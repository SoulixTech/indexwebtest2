// ============================================
// GOOGLE SHEETS SYNC - NEW CLEAN VERSION
// Only adds NEW entries to Supabase
// ============================================

const SHEETS_CONFIG = {
    sheetId: '1jyY4SI-cIHfj-Q-vhAy61IigF7zi9DE2nIkDmUe-IO4',
    syncInterval: 10000 // 10 seconds
};

let syncTimer = null;
let lastSyncHash = null;

// ============================================
// START AUTO SYNC
// ============================================
function startSheetsSync() {
    console.log('🔄 Starting Google Sheets sync...');
    
    // Initial sync
    syncFromSheets();
    
    // Auto sync every 10 seconds
    syncTimer = setInterval(syncFromSheets, SHEETS_CONFIG.syncInterval);
    
    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && syncTimer) {
            clearInterval(syncTimer);
            syncTimer = null;
        } else if (!document.hidden && !syncTimer) {
            syncTimer = setInterval(syncFromSheets, SHEETS_CONFIG.syncInterval);
        }
    });
}

// ============================================
// SYNC FROM GOOGLE SHEETS
// ============================================
async function syncFromSheets() {
    try {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.sheetId}/export?format=csv&gid=0`;
        
        const response = await fetch(csvUrl, {
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const csvText = await response.text();
        
        // Check if data changed
        const currentHash = hashString(csvText);
        if (currentHash === lastSyncHash) {
            return; // No changes
        }
        lastSyncHash = currentHash;
        
        const entries = parseCSV(csvText);
        console.log(`📊 Found ${entries.length} entries in Google Sheets`);
        
        // Add only NEW entries to Supabase
        await addNewEntriesToSupabase(entries);
        
    } catch (error) {
        console.error('❌ Sheets sync error:', error.message);
    }
}

// ============================================
// ADD NEW ENTRIES TO SUPABASE
// ============================================
async function addNewEntriesToSupabase(sheetEntries) {
    if (!window.DataManager || !window.DataManager.isReady()) {
        console.warn('⚠️ Data Manager not ready');
        return;
    }
    
    try {
        // Get existing IDs from Supabase
        const existingApps = window.DataManager.getAll();
        const existingIds = new Set(existingApps.map(app => app.id));
        
        // Filter NEW entries
        const newEntries = sheetEntries.filter(entry => !existingIds.has(entry.id));
        
        if (newEntries.length === 0) {
            return; // No new entries
        }
        
        console.log(`🆕 Adding ${newEntries.length} new entries to Supabase...`);
        
        // Get Supabase client (from data-manager.js)
        const supabase = window.supabase.createClient(
            'https://xmtxeagxnqfczenqwizz.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdHhlYWd4bnFmY3plbnF3aXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0Mzg3MTgsImV4cCI6MjA3ODAxNDcxOH0.NUTpXhNfoXkcCrWhGE2-j4V6p9VydN6EkLPUCBVqeh8'
        );
        
        // Insert new entries
        const { data, error } = await supabase
            .from('applications')
            .insert(newEntries);
        
        if (error) throw error;
        
        console.log(`✅ Added ${newEntries.length} new applications`);
        
        // Reload data
        if (window.DataManager && window.DataManager.reload) {
            await window.DataManager.reload();
        }
        
        // Show notification
        if (window.showToast) {
            window.showToast('success', '🆕 New Applications', 
                `${newEntries.length} new application(s) from Google Sheets`);
        }
        
    } catch (error) {
        console.error('❌ Error adding entries:', error);
    }
}

// ============================================
// PARSE CSV
// ============================================
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const entries = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length < 2) continue;
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        const entry = convertRowToSupabaseFormat(row, i);
        if (entry) entries.push(entry);
    }
    
    return entries;
}

// ============================================
// CONVERT ROW TO SUPABASE FORMAT
// ============================================
function convertRowToSupabaseFormat(row, index) {
    const getId = () => {
        return row['Response id'] || row['ID'] || row['id'] || `APP${String(index).padStart(3, '0')}`;
    };
    
    const getName = () => {
        const firstName = row['Enter your name / first name'] || row['first name'] || '';
        const lastName = row['Enter your name / last name'] || row['last name'] || '';
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : row['Name'] || row['name'] || '';
    };
    
    const getEmail = () => {
        return row['Your Email'] || row['Email'] || row['email'] || '';
    };
    
    const getPhone = () => {
        const phoneKeys = Object.keys(row).filter(k => 
            k.toLowerCase().includes('phone') || k.toLowerCase().includes('mobile')
        );
        return phoneKeys.length > 0 ? row[phoneKeys[0]] : '';
    };
    
    const getCourse = () => {
        const courseKeys = Object.keys(row).filter(k => 
            k.toLowerCase().includes('course') && 
            !k.toLowerCase().includes('interested') &&
            !k.toLowerCase().includes('which')
        );
        
        // Debug: Log what we found
        if (courseKeys.length > 0) {
            console.log(`📚 Course column found: "${courseKeys[0]}" = "${row[courseKeys[0]]}"`);
        }
        
        return courseKeys.length > 0 ? row[courseKeys[0]] : '';
    };
    
    const getPaymentType = () => {
        const paymentKeys = Object.keys(row).filter(k => 
            k.toLowerCase().includes('payment method')
        );
        return paymentKeys.length > 0 ? row[paymentKeys[0]] : null;
    };
    
    const getUPIId = () => {
        const upiKeys = Object.keys(row).filter(k => 
            k.toLowerCase().includes('upi') || k.toLowerCase().includes('transaction')
        );
        return upiKeys.length > 0 ? row[upiKeys[0]] : null;
    };
    
    const getDate = () => {
        const dateStr = row['Response created at'] || row['Date'] || row['Timestamp'];
        if (!dateStr) return new Date().toISOString();
        try {
            return new Date(dateStr).toISOString();
        } catch (e) {
            return new Date().toISOString();
        }
    };
    
    const name = getName();
    const email = getEmail();
    
    if (!name || !email) return null;
    
    return {
        id: getId(),
        name: name,
        email: email,
        phone: getPhone(),
        course: getCourse(),
        status: 'Pending',
        applied_date: getDate(),
        approved_date: null,
        rejected_date: null,
        payment_type: getPaymentType(),
        payment_amount: null,
        payment_status: 'Pending',
        upi_transaction_id: getUPIId(),
        installments_paid: 0,
        total_installments: 2,
        rejection_reason: null,
        approved_by: null,
        rejected_by: null
    };
}

// ============================================
// UTILITY
// ============================================
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

// ============================================
// EXPORT
// ============================================
window.SheetsSync = {
    start: startSheetsSync
};

console.log('📦 Sheets Sync loaded');
