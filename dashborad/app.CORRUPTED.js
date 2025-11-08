// ==============================================// ==============================================

// SOULIX TECH ADMIN DASHBOARD - NEW CLEAN VERSION// SOULIX TECH ADMIN DASHBOARD - JavaScript

// Pure Supabase Architecture// Modern Application Management System

// ==============================================// ==============================================



let applications = [];let applications = [];

let notifications = 0;

// ============================================

// INITIALIZE DASHBOARD// Initialize Dashboard

// ============================================document.addEventListener('DOMContentLoaded', async function() {

document.addEventListener('DOMContentLoaded', async function() {    console.log('🚀 Initializing Dashboard...');

    console.log('🚀 Starting Dashboard...');    

        // Initialize Supabase FIRST

    // Check authentication    const supabaseReady = initSupabase();

    checkAuth();    

        if (!supabaseReady) {

    // Wait for DataManager to initialize        console.error('❌ Supabase failed to initialize');

    if (!window.DataManager) {        showToast('error', 'Database Error', 'Cannot connect to database. Please refresh the page.');

        console.error('❌ DataManager not loaded');        applications = getSampleApplications(); // Fallback

        showToast('error', 'System Error', 'Data Manager failed to load');        return;

        return;    }

    }    

        // Check connection

    // Initialize data    const connectionStatus = await checkSupabaseConnection();

    const result = await DataManager.init();    

        if (!connectionStatus.connected) {

    if (!result.success) {        console.error('❌ Supabase not connected:', connectionStatus.error);

        console.error('❌ Initialization failed:', result.error);        showToast('error', 'Database Connection Failed', 'Cannot load data. Please check your internet connection.');

        showToast('error', 'Connection Failed', 'Cannot connect to database');        applications = getSampleApplications(); // Fallback

        return;        return;

    }    }

        

    console.log('✅ Dashboard initialized');    console.log('✅ Supabase connected successfully');

        

    // Load applications    // ============================================

    applications = DataManager.getAll();    // LOAD ALL DATA FROM SUPABASE ONLY

        // No localStorage, No merging, Pure Supabase

    // Save login session    // ============================================

    await DataManager.saveLoginSession();    

        await loadDataFromSupabase();

    // Load logs    

    const logs = await DataManager.getLogs(50);    // Auto-migrate old localStorage data (one-time)

    logs.reverse().forEach(log => {    if (typeof autoMigrateToSupabase === 'function') {

        addAdminLog(log.log_type, log.title, log.message, false);        const migrationResult = await autoMigrateToSupabase();

    });        if (migrationResult.success > 0) {

                console.log(`✅ Migrated ${migrationResult.success} old applications`);

    // Initialize UI            await loadDataFromSupabase(); // Reload after migration

    initUI();        }

        }

    // Listen for data updates    

    window.addEventListener('dataUpdated', function() {    // Save login session to Supabase

        applications = DataManager.getAll();    await saveLoginSessionToSupabase();

        updateAllStats();    

        renderApplications();    // Load and display logs from Supabase

        renderRecentApplications();    const logs = await loadLogsFromSupabase(50);

        updateCharts();    if (logs && logs.length > 0) {

    });        logs.reverse().forEach(log => {

                addAdminLog(log.log_type, log.title, log.message, false);

    // Start Google Sheets sync        });

    if (window.SheetsSync) {    }

        window.SheetsSync.start();    

    }    // Log login session details (local)

});    logLoginSession();

    

// ============================================    initNavigation();

// AUTHENTICATION    initMobileMenu();

// ============================================    initDateTime();

function checkAuth() {    initScrollProgress();

    const adminUsername = sessionStorage.getItem('adminUsername');    initBackToTop();

    if (!adminUsername) {    initKeyboardShortcuts();

        window.location.href = 'login.html';    initAdminLog();

        return;    

    }    updateAllStats();

}    renderApplications();

    renderRecentApplications();

// ============================================    initCharts();

// UI INITIALIZATION    initFilters();

// ============================================    setupToastClose();

function initUI() {    addRippleEffect();

    initNavigation();    addTooltips();

    initMobileMenu();    

    initDateTime();    // Update time every minute

    initScrollProgress();    setInterval(initDateTime, 60000);

    initBackToTop();    

    initKeyboardShortcuts();    // Auto-refresh stats every 30 seconds (debounced)

    initAdminLog();    let statsUpdateTimer;

        setInterval(function() {

    updateAllStats();        clearTimeout(statsUpdateTimer);

    renderApplications();        statsUpdateTimer = setTimeout(() => {

    renderRecentApplications();            updateAllStats();

    initCharts();            addTooltips();

    initFilters();        }, 100);

    setupToastClose();    }, 30000);

    addRippleEffect();    

    addTooltips();    // Sync data across tabs/devices via Supabase real-time

        // (Real-time subscription handled in supabase-config.js)

    // Update time every minute    window.addEventListener('dataUpdated', function(e) {

    setInterval(initDateTime, 60000);        console.log('📡 Data updated event:', e.detail);

            updateAllStats();

    // Auto-refresh stats every 30 seconds        renderApplications();

    setInterval(() => {        renderRecentApplications();

        updateAllStats();        updateCharts();

        addTooltips();    });

    }, 30000);});

}

// Log Login Session Details

// ============================================function logLoginSession() {

// NAVIGATION    const deviceInfo = sessionStorage.getItem('deviceInfo');

// ============================================    const loginTime = sessionStorage.getItem('loginTime');

function initNavigation() {    const username = sessionStorage.getItem('adminUsername') || 'Admin';

    const navLinks = document.querySelectorAll('.nav-link');    

    const sections = document.querySelectorAll('.dashboard-section');    if (deviceInfo && loginTime) {

            try {

    navLinks.forEach(link => {            const info = JSON.parse(deviceInfo);

        link.addEventListener('click', function(e) {            const loginDate = new Date(loginTime);

            e.preventDefault();            const timeAgo = getTimeAgo(loginDate);

            const targetId = this.getAttribute('href').substring(1);            

                        // Create detailed login log message

            navLinks.forEach(l => l.classList.remove('active'));            const logMessage = `

            this.classList.add('active');                👤 User: ${username}

                            📱 Device: ${info.deviceType}

            sections.forEach(section => {                🌐 Browser: ${info.browser}

                section.style.display = section.id === targetId ? 'block' : 'none';                💻 Platform: ${info.platform}

            });                📏 Screen: ${info.screenResolution}

                            ⏰ Time: ${timeAgo}

            if (targetId === 'dashboard') {            `.trim().replace(/\s+/g, ' ');

                updateAllStats();            

                renderRecentApplications();            addAdminLog('success', '🔐 Login Session', logMessage);

                updateCharts();            

            } else if (targetId === 'applications') {            // Log previous session if exists

                renderApplications();            const loginSessions = JSON.parse(localStorage.getItem('loginSessions') || '[]');

            } else if (targetId === 'approved') {            if (loginSessions.length > 1) {

                renderApprovedApplications();                const prevSession = loginSessions[loginSessions.length - 2];

            } else if (targetId === 'rejected') {                if (prevSession) {

                renderRejectedApplications();                    const prevTime = getTimeAgo(new Date(prevSession.loginTime));

            }                    addAdminLog('info', '📜 Previous Login', 

        });                        `${prevSession.deviceType} • ${prevSession.browser} • ${prevTime}`);

    });                }

}            }

        } catch (e) {

function initMobileMenu() {            console.error('Error logging session:', e);

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');        }

    const sidebar = document.querySelector('.sidebar');    }

    const overlay = document.querySelector('.sidebar-overlay');}

    

    if (mobileMenuBtn) {// Get time ago helper

        mobileMenuBtn.addEventListener('click', () => {function getTimeAgo(date) {

            sidebar.classList.toggle('active');    const seconds = Math.floor((new Date() - date) / 1000);

            overlay.classList.toggle('active');    if (seconds < 60) return 'Just now';

        });    const minutes = Math.floor(seconds / 60);

    }    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;

        const hours = Math.floor(minutes / 60);

    if (overlay) {    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

        overlay.addEventListener('click', () => {    const days = Math.floor(hours / 24);

            sidebar.classList.remove('active');    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

            overlay.classList.remove('active');    return date.toLocaleDateString();

        });}

    }

}// Keyboard Shortcuts

function initKeyboardShortcuts() {

function initDateTime() {    document.addEventListener('keydown', function(e) {

    const now = new Date();        // Ctrl/Cmd + K = Focus search

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {

    const dateTimeElement = document.getElementById('currentDateTime');            e.preventDefault();

    if (dateTimeElement) {            const searchInput = document.querySelector('.search-box input');

        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);            searchInput?.focus();

    }        }

}        

        // Ctrl/Cmd + 1-6 = Navigate sections

function initScrollProgress() {        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {

    window.addEventListener('scroll', () => {            e.preventDefault();

        const winScroll = document.documentElement.scrollTop;            const sections = ['overview', 'applications', 'approved', 'rejected', 'analytics', 'courses'];

        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;            const index = parseInt(e.key) - 1;

        const scrolled = (winScroll / height) * 100;            document.querySelector(`[data-section="${sections[index]}"]`)?.click();

        const progressBar = document.querySelector('.scroll-progress');        }

        if (progressBar) {        

            progressBar.style.width = scrolled + '%';        // Ctrl/Cmd + R = Refresh data

        }        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {

    });            e.preventDefault();

}            updateAllStats();

            renderApplications();

function initBackToTop() {            renderRecentApplications();

    const backToTopBtn = document.getElementById('backToTop');            updateCharts();

    if (backToTopBtn) {            showToast('info', 'Refreshed', 'Data updated successfully!');

        window.addEventListener('scroll', () => {        }

            if (window.pageYOffset > 300) {    });

                backToTopBtn.classList.add('visible');}

            } else {

                backToTopBtn.classList.remove('visible');// Back to Top Button

            }function initBackToTop() {

        });    const backToTop = document.getElementById('backToTop');

            if (!backToTop) return;

        backToTopBtn.addEventListener('click', () => {    

            window.scrollTo({ top: 0, behavior: 'smooth' });    window.addEventListener('scroll', function() {

        });        if (window.pageYOffset > 300) {

    }            backToTop.classList.add('show');

}        } else {

            backToTop.classList.remove('show');

function initKeyboardShortcuts() {        }

    document.addEventListener('keydown', (e) => {    });

        if (e.ctrlKey || e.metaKey) {    

            switch(e.key) {    backToTop.addEventListener('click', function() {

                case 'k':        window.scrollTo({ top: 0, behavior: 'smooth' });

                    e.preventDefault();        if (navigator.vibrate) navigator.vibrate(20);

                    document.getElementById('searchInput')?.focus();    });

                    break;}

                case '/':

                    e.preventDefault();// Scroll Progress Bar

                    document.getElementById('searchInput')?.focus();function initScrollProgress() {

                    break;    const progressBar = document.getElementById('scrollProgress');

            }    if (!progressBar) return;

        }    

    });    window.addEventListener('scroll', function() {

}        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

function initAdminLog() {        const scrolled = (winScroll / height) * 100;

    const adminUsername = sessionStorage.getItem('adminUsername') || 'Admin';        progressBar.style.width = scrolled + '%';

    const deviceInfo = getDeviceInfo();    });

    const loginTime = sessionStorage.getItem('loginTime');}

    

    if (loginTime) {// Add Ripple Effect to Buttons

        const loginDate = new Date(loginTime);function addRippleEffect() {

        const timeAgo = getTimeAgo(loginDate);    const buttons = document.querySelectorAll('.btn-action, .btn-login, .notification-btn');

            buttons.forEach(button => {

        addAdminLog('success', '🔐 Login Session',         if (!button.classList.contains('ripple')) {

            `👤 ${adminUsername} • 📱 ${deviceInfo.deviceType} • 🌐 ${deviceInfo.browser} • ⏰ ${timeAgo}`);            button.classList.add('ripple');

    }        }

}    });

}

// ============================================

// UPDATE STATS// Add Tooltips

// ============================================function addTooltips() {

function updateAllStats() {    const notificationBtn = document.querySelector('.notification-btn');

    const pending = applications.filter(app => app.status === 'Pending').length;    if (notificationBtn && !notificationBtn.getAttribute('data-tooltip')) {

    const approved = applications.filter(app => app.status === 'Approved').length;        const pendingCount = document.getElementById('totalPending')?.textContent || '0';

    const rejected = applications.filter(app => app.status === 'Rejected').length;        notificationBtn.setAttribute('data-tooltip', `${pendingCount} pending applications`);

    const total = applications.length;        notificationBtn.classList.add('tooltip');

        }

    animateValue('totalPending', pending);}

    animateValue('totalApproved', approved);

    animateValue('totalRejected', rejected);// Confetti Animation

    animateValue('totalApplications', total);function createConfetti() {

        const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

    const pendingBadge = document.getElementById('pendingBadge');    const confettiCount = 50;

    const notificationCount = document.getElementById('notificationCount');    

    if (pendingBadge) pendingBadge.textContent = pending;    for (let i = 0; i < confettiCount; i++) {

    if (notificationCount) notificationCount.textContent = pending;        const confetti = document.createElement('div');

            confetti.className = 'confetti';

    const allCount = document.getElementById('allCount');        confetti.style.left = Math.random() * 100 + '%';

    const pendingCount = document.getElementById('pendingCount');        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    if (allCount) allCount.textContent = total;        confetti.style.animationDelay = Math.random() * 0.5 + 's';

    if (pendingCount) pendingCount.textContent = pending;        confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear forwards`;

            document.body.appendChild(confetti);

    const today = new Date().toDateString();        

    const todayCount = applications.filter(app =>         setTimeout(() => confetti.remove(), 4000);

        new Date(app.appliedDate).toDateString() === today    }

    ).length;}

    const todayCountElement = document.getElementById('todayCount');

    if (todayCountElement) todayCountElement.textContent = todayCount;// Mobile Menu

}function initMobileMenu() {

    const toggle = document.getElementById('mobileMenuToggle');

function animateValue(id, target) {    const sidebar = document.querySelector('.sidebar');

    const element = document.getElementById(id);    const overlay = document.getElementById('sidebarOverlay');

    if (!element) return;    const closeBtn = document.getElementById('sidebarClose');

        

    const current = parseInt(element.textContent) || 0;    function closeSidebar() {

    const increment = (target - current) / 20;        sidebar.classList.remove('mobile-open');

    let count = 0;        overlay.classList.remove('show');

            toggle?.classList.remove('menu-open');

    const timer = setInterval(() => {        document.body.style.overflow = '';

        count++;        // Haptic feedback

        const value = Math.round(current + increment * count);        if (navigator.vibrate) navigator.vibrate(30);

        element.textContent = value;    }

            

        if (count >= 20) {    function openSidebar() {

            clearInterval(timer);        sidebar.classList.add('mobile-open');

            element.textContent = target;        overlay.classList.add('show');

        }        toggle?.classList.add('menu-open');

    }, 15);        document.body.style.overflow = 'hidden';

}        // Haptic feedback

        if (navigator.vibrate) navigator.vibrate(30);

// ============================================    }

// RENDER APPLICATIONS    

// ============================================    if (toggle) {

function renderApplications() {        toggle.addEventListener('click', function(e) {

    const container = document.getElementById('applicationsList');            e.stopPropagation();

    if (!container) return;            const isOpen = sidebar.classList.contains('mobile-open');

                if (isOpen) {

    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'all';                closeSidebar();

                } else {

    let filteredApps = applications;                openSidebar();

    if (activeTab === 'pending') filteredApps = applications.filter(app => app.status === 'Pending');            }

    else if (activeTab === 'today') {        });

        const today = new Date().toDateString();    }

        filteredApps = applications.filter(app => new Date(app.appliedDate).toDateString() === today);    

    }    if (closeBtn) {

            closeBtn.addEventListener('click', function(e) {

    if (filteredApps.length === 0) {            e.stopPropagation();

        container.innerHTML = '<div class="no-data">📭 No applications found</div>';            closeSidebar();

        return;        });

    }    }

        

    container.innerHTML = filteredApps.map(app => `    if (overlay) {

        <div class="application-card ${app.status.toLowerCase()}" data-id="${app.id}">        overlay.addEventListener('click', closeSidebar);

            <div class="app-header">    }

                <div class="app-info">    

                    <h3>${app.name}</h3>    // Close menu when navigation item is clicked

                    <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span>    const navItems = document.querySelectorAll('.nav-item');

                </div>    navItems.forEach(item => {

                <div class="app-actions">        item.addEventListener('click', function() {

                    ${app.status === 'Pending' ? `            if (window.innerWidth <= 1024) {

                        <button class="btn-approve" onclick="approveApplication('${app.id}')">                closeSidebar();

                            <i class="fas fa-check"></i> Approve            }

                        </button>        });

                        <button class="btn-reject" onclick="rejectApplication('${app.id}')">    });

                            <i class="fas fa-times"></i> Reject    

                        </button>    // Handle window resize

                    ` : ''}    window.addEventListener('resize', function() {

                </div>        if (window.innerWidth > 1024) {

            </div>            closeSidebar();

            <div class="app-details">        }

                <p><strong>📧 Email:</strong> ${app.email}</p>    });

                <p><strong>📱 Phone:</strong> ${app.phone}</p>    

                <p><strong>📚 Course:</strong> ${app.course}</p>    // Handle escape key

                <p><strong>📅 Applied:</strong> ${formatDate(app.appliedDate)}</p>    document.addEventListener('keydown', function(e) {

                ${app.paymentType ? `<p><strong>💳 Payment:</strong> ${app.paymentType}</p>` : ''}        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {

            </div>            closeSidebar();

        </div>        }

    `).join('');    });

}    

    // Swipe to close sidebar

function renderRecentApplications() {    let touchStartX = 0;

    const container = document.getElementById('recentApplicationsList');    let touchEndX = 0;

    if (!container) return;    

        if (sidebar) {

    const recent = applications.slice(0, 5);        sidebar.addEventListener('touchstart', function(e) {

                touchStartX = e.changedTouches[0].screenX;

    container.innerHTML = recent.map(app => `        }, { passive: true });

        <div class="recent-app-item">        

            <div class="recent-app-info">        sidebar.addEventListener('touchend', function(e) {

                <h4>${app.name}</h4>            touchEndX = e.changedTouches[0].screenX;

                <p>${app.course}</p>            handleSwipe();

                <small>${formatDate(app.appliedDate)}</small>        }, { passive: true });

            </div>    }

            <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span>    

        </div>    function handleSwipe() {

    `).join('');        // Swipe left to close (at least 100px)

}        if (touchStartX - touchEndX > 100 && sidebar.classList.contains('mobile-open')) {

            closeSidebar();

function renderApprovedApplications() {        }

    const container = document.getElementById('approvedList');    }

    if (!container) return;}

    

    const approved = DataManager.getApproved();// Load Data

    // ============================================

    if (approved.length === 0) {// LOAD DATA FROM SUPABASE (NO LOCALSTORAGE)

        container.innerHTML = '<div class="no-data">📭 No approved applications</div>';// ============================================

        return;async function loadDataFromSupabase() {

    }    if (typeof supabase === 'undefined' || !supabase) {

            console.error('❌ Supabase not available');

    container.innerHTML = approved.map(app => `        applications = getSampleApplications();

        <div class="application-card approved">        return;

            <div class="app-header">    }

                <div class="app-info">    

                    <h3>${app.name}</h3>    try {

                    <span class="status-badge status-approved">Approved</span>        const { data, error } = await supabase

                </div>            .from('applications')

            </div>            .select('*')

            <div class="app-details">            .order('applied_date', { ascending: false });

                <p><strong>📧 Email:</strong> ${app.email}</p>        

                <p><strong>📚 Course:</strong> ${app.course}</p>        if (error) throw error;

                <p><strong>✅ Approved:</strong> ${formatDate(app.approvedDate)}</p>        

                <p><strong>💰 Amount:</strong> ₹${app.paymentAmount || 'N/A'}</p>        // Convert Supabase format to local format

            </div>        applications = (data || []).map(app => ({

        </div>            id: app.id,

    `).join('');            name: app.name,

}            email: app.email,

            phone: app.phone,

function renderRejectedApplications() {            course: app.course,

    const container = document.getElementById('rejectedList');            status: app.status,

    if (!container) return;            appliedDate: app.applied_date,

                approvedDate: app.approved_date,

    const rejected = DataManager.getRejected();            rejectedDate: app.rejected_date,

                paymentType: app.payment_type,

    if (rejected.length === 0) {            paymentAmount: app.payment_amount,

        container.innerHTML = '<div class="no-data">📭 No rejected applications</div>';            paymentStatus: app.payment_status,

        return;            upiTransactionId: app.upi_transaction_id,

    }            installmentsPaid: app.installments_paid,

                totalInstallments: app.total_installments,

    container.innerHTML = rejected.map(app => `            rejectionReason: app.rejection_reason,

        <div class="application-card rejected">            approvedBy: app.approved_by ? JSON.parse(app.approved_by) : null,

            <div class="app-header">            rejectedBy: app.rejected_by ? JSON.parse(app.rejected_by) : null

                <div class="app-info">        }));

                    <h3>${app.name}</h3>        

                    <span class="status-badge status-rejected">Rejected</span>        console.log(`✅ Loaded ${applications.length} applications from Supabase`);

                </div>        

            </div>        // Dispatch event for UI updates

            <div class="app-details">        window.dispatchEvent(new CustomEvent('dataUpdated', { 

                <p><strong>📧 Email:</strong> ${app.email}</p>            detail: { timestamp: Date.now(), source: 'supabase' } 

                <p><strong>📚 Course:</strong> ${app.course}</p>        }));

                <p><strong>❌ Rejected:</strong> ${formatDate(app.rejectedDate)}</p>        

                <p><strong>📝 Reason:</strong> ${app.rejectionReason || 'Not specified'}</p>    } catch (error) {

            </div>        console.error('❌ Error loading from Supabase:', error);

        </div>        applications = getSampleApplications();

    `).join('');    }

}}



// ============================================// Legacy loadData function - now just calls loadDataFromSupabase

// APPROVE APPLICATIONfunction loadData() {

// ============================================    console.warn('⚠️ loadData() is deprecated - using Supabase');

function approveApplication(id) {    // If Supabase available, load from there

    const app = DataManager.getById(id);    if (typeof loadDataFromSupabase === 'function') {

    if (!app) return;        loadDataFromSupabase();

        }

    const paymentAmount = prompt(}

        `Approve ${app.name}'s application?\n\n` +

        `Payment Type: ${app.paymentType || 'Full Payment'}\n` +// ============================================

        `${app.upiTransactionId ? 'UPI Transaction ID: ' + app.upiTransactionId : ''}\n\n` +// SAVE DATA TO SUPABASE (NO LOCALSTORAGE)

        `Enter payment amount received:`// ============================================

    );function saveData() {

        console.log('💾 Saving data to Supabase...');

    if (paymentAmount !== null && paymentAmount.trim() !== '') {    

        const paymentDetails = {    // Dispatch custom event for same-tab updates

            amount: paymentAmount,    window.dispatchEvent(new CustomEvent('dataUpdated', { 

            type: app.paymentType || 'Full Payment',        detail: { timestamp: Date.now(), source: 'save' } 

            status: 'Paid'    }));

        };    

            // Note: Individual save functions (saveToSupabase, saveApprovedApplication, etc.)

        DataManager.approve(id, paymentDetails).then(result => {    // are called directly when approving/rejecting, so we don't need to loop here

            if (result.success) {}

                console.log('✅ Application approved');

                // Navigation

                // Send emailfunction initNavigation() {

                sendApprovalEmail(app, paymentAmount);    const navItems = document.querySelectorAll('.nav-item');

                    const sections = document.querySelectorAll('.content-section');

                // Show success    

                showToast('success', 'Application Approved!',     navItems.forEach(item => {

                    `${app.name} approved! Payment: ₹${paymentAmount}`);        item.addEventListener('click', function(e) {

                            e.preventDefault();

                // Save log            navItems.forEach(nav => nav.classList.remove('active'));

                DataManager.saveLog('success', '✅ Application Approved',             sections.forEach(section => section.classList.remove('active'));

                    `${app.name} • ${app.course} • ₹${paymentAmount}`);            this.classList.add('active');

                            const sectionId = this.getAttribute('data-section') + '-section';

                // Confetti            document.getElementById(sectionId)?.classList.add('active');

                createConfetti();            

                            const titles = {

                // Haptic feedback                'overview': 'Dashboard Overview',

                if (navigator.vibrate) {                'applications': 'Student Applications',

                    navigator.vibrate([50, 30, 50]);                'approved': 'Approved Students',

                }                'rejected': 'Rejected Applications',

            } else {                'analytics': 'Analytics & Insights',

                showToast('error', 'Approval Failed', result.error);                'courses': 'Course Management',

            }                'payments': 'Payment History'

        });            };

    }            

}            const section = this.getAttribute('data-section');

            document.getElementById('page-title').textContent = titles[section] || 'Dashboard';

// ============================================            

// REJECT APPLICATION            // Render appropriate content

// ============================================            if (section === 'applications') renderApplications();

function rejectApplication(id) {            if (section === 'approved') renderApproved();

    const app = DataManager.getById(id);            if (section === 'rejected') renderRejected();

    if (!app) return;            if (section === 'payments') renderPaymentHistory();

            });

    const reason = prompt(`Reject ${app.name}'s application?\n\nEnter rejection reason:`);    });

        

    if (reason !== null && reason.trim() !== '') {    // View all link

        DataManager.reject(id, reason).then(result => {    document.querySelectorAll('.view-all-link').forEach(link => {

            if (result.success) {        link.addEventListener('click', function(e) {

                console.log('❌ Application rejected');            e.preventDefault();

                            const section = this.getAttribute('data-section');

                // Send email            document.querySelector(`[data-section="${section}"]`)?.click();

                sendRejectionEmail(app, reason);        });

                    });

                // Show message}

                showToast('info', 'Application Rejected', 

                    `${app.name}'s application has been rejected`);// Date Time

                function initDateTime() {

                // Save log    const now = new Date();

                DataManager.saveLog('warning', '❌ Application Rejected',     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

                    `${app.name} • ${app.course} • ${reason}`);    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);

            } else {}

                showToast('error', 'Rejection Failed', result.error);

            }// Update Stats

        });function updateAllStats() {

    }    // Data is already loaded from Supabase, just calculate stats

}    const pending = applications.filter(app => app.status === 'Pending').length;

    const approved = applications.filter(app => app.status === 'Approved').length;

// ============================================    const rejected = applications.filter(app => app.status === 'Rejected').length;

// SEND EMAILS    const total = applications.length;

// ============================================    

async function sendApprovalEmail(app, amount) {    // Animate number changes

    if (typeof sendApprovalEmail === 'undefined') {    animateValue('totalPending', pending);

        console.warn('⚠️ Email function not available');    animateValue('totalApproved', approved);

        return;    animateValue('totalRejected', rejected);

    }    animateValue('totalApplications', total);

        

    try {    // Update badges

        const result = await window.sendApprovalEmail(    document.getElementById('pendingBadge').textContent = pending;

            app.email,    document.getElementById('notificationCount').textContent = pending;

            app.name,    

            app.upiTransactionId || 'N/A',    // Update tab counts

            app.course,    document.getElementById('allCount').textContent = total;

            'approve',    document.getElementById('pendingCount').textContent = pending;

            ''    

        );    const today = new Date().toDateString();

            const todayCount = applications.filter(app => new Date(app.appliedDate).toDateString() === today).length;

        if (result.success) {    document.getElementById('todayCount').textContent = todayCount;

            console.log('✅ Email sent');    

        }    // Update course stats

    } catch (error) {    updateCourseStats();

        console.error('❌ Email error:', error);    

    }    // Store last update timestamp to prevent stale data

}    localStorage.setItem('lastStatsUpdate', Date.now().toString());

}

async function sendRejectionEmail(app, reason) {

    if (typeof sendApprovalEmail === 'undefined') {// Animate Number Change (Optimized)

        console.warn('⚠️ Email function not available');function animateValue(id, endValue, duration = 500) {

        return;    const element = typeof id === 'string' ? document.getElementById(id) : id;

    }    if (!element) return;

        

    try {    const startValue = parseInt(element.textContent) || 0;

        const result = await window.sendApprovalEmail(    if (startValue === endValue) return;

            app.email,    

            app.name,    const startTime = performance.now();

            '',    const delta = endValue - startValue;

            app.course,    

            'reject',    function update(currentTime) {

            reason        const elapsed = currentTime - startTime;

        );        const progress = Math.min(elapsed / duration, 1);

                const value = Math.round(startValue + (delta * progress));

        if (result.success) {        

            console.log('✅ Email sent');        element.textContent = value;

        }        

    } catch (error) {        if (progress < 1) {

        console.error('❌ Email error:', error);            requestAnimationFrame(update);

    }        }

}    }

    

// ============================================    requestAnimationFrame(update);

// CHARTS}

// ============================================

function initCharts() {function updateCourseStats() {

    initTrendsChart();    const courses = ['Web Development', 'IoT & ESP32', 'C Programming', 'Python Programming'];

    initCourseChart();    

}    courses.forEach(course => {

        const approved = applications.filter(app => app.course === course && app.status === 'Approved').length;

function updateCharts() {        const pending = applications.filter(app => app.course === course && app.status === 'Pending').length;

    initTrendsChart();        

    initCourseChart();        // Update enrollment counts

}        document.querySelectorAll(`.stat-value[data-course="${course}"][data-status="Approved"]`).forEach(el => {

            el.textContent = approved;

function initTrendsChart() {        });

    const canvas = document.getElementById('trendsChart');        

    if (!canvas) return;        // Update pending counts

            document.querySelectorAll(`.pending-count[data-course="${course}"]`).forEach(el => {

    const ctx = canvas.getContext('2d');            el.textContent = pending;

    if (!window.Chart) {        });

        console.warn('Chart.js not loaded');        

        return;        // Update progress bars

    }        const maxCapacity = 50; // Assumed max per course

            const percentage = Math.min((approved / maxCapacity) * 100, 100);

    // Destroy existing chart        document.querySelectorAll(`.progress-fill[data-course="${course}"]`).forEach(el => {

    if (canvas.chart) {            el.style.width = percentage + '%';

        canvas.chart.destroy();            el.closest('.course-progress').querySelector('.progress-text').textContent = Math.round(percentage) + '% Capacity';

    }        });

        });

    // Get data for last 7 days}

    const days = [];

    const counts = [];// Render Applications

    function renderApplications(filter = 'all') {

    for (let i = 6; i >= 0; i--) {    const grid = document.getElementById('applicationsGrid');

        const date = new Date();    let filtered = applications;

        date.setDate(date.getDate() - i);    

        days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));    if (filter === 'pending') {

                filtered = applications.filter(app => app.status === 'Pending');

        const dayStr = date.toDateString();    } else if (filter === 'today') {

        const count = applications.filter(app =>         const today = new Date().toDateString();

            new Date(app.appliedDate).toDateString() === dayStr        filtered = applications.filter(app => new Date(app.appliedDate).toDateString() === today);

        ).length;    }

        counts.push(count);    

    }    if (filtered.length === 0) {

            grid.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No applications found</h3><p>Applications will appear here</p></div>';

    canvas.chart = new Chart(ctx, {        return;

        type: 'line',    }

        data: {    

            labels: days,    grid.innerHTML = filtered.map(app => `

            datasets: [{        <div class="application-card">

                label: 'Applications',            <div class="app-header">

                data: counts,                <div class="app-avatar">${app.name.charAt(0).toUpperCase()}</div>

                borderColor: '#667eea',                <span class="app-status ${app.status.toLowerCase()}">${app.status}</span>

                backgroundColor: 'rgba(102, 126, 234, 0.1)',            </div>

                tension: 0.4,            <div class="app-body">

                fill: true                <h3 class="app-name">${app.name}</h3>

            }]                <div class="app-info">

        },                    <div class="info-item"><i class="fas fa-envelope"></i> ${app.email}</div>

        options: {                    <div class="info-item"><i class="fas fa-phone"></i> ${app.phone}</div>

            responsive: true,                    <div class="info-item"><i class="fas fa-graduation-cap"></i> ${app.course}</div>

            maintainAspectRatio: false,                    <div class="info-item"><i class="fas fa-calendar"></i> ${formatDate(app.appliedDate)}</div>

            plugins: {                </div>

                legend: { display: false }            </div>

            }            <div class="app-footer">

        }                <button class="btn-action btn-view" onclick="viewApplication('${app.id}')">

    });                    <i class="fas fa-eye"></i> View

}                </button>

                ${app.status === 'Pending' ? `

function initCourseChart() {                    <button class="btn-action btn-approve" onclick="approveApplication('${app.id}')">

    const canvas = document.getElementById('courseChart');                        <i class="fas fa-check"></i> Approve

    if (!canvas) return;                    </button>

                        <button class="btn-action btn-reject" onclick="rejectApplication('${app.id}')">

    const ctx = canvas.getContext('2d');                        <i class="fas fa-times"></i> Reject

    if (!window.Chart) return;                    </button>

                    ` : ''}

    // Destroy existing chart            </div>

    if (canvas.chart) {        </div>

        canvas.chart.destroy();    `).join('');

    }}

    

    // Count by coursefunction renderApproved() {

    const courseCounts = {};    const grid = document.getElementById('approvedGrid');

    applications.forEach(app => {    const approved = applications.filter(app => app.status === 'Approved');

        courseCounts[app.course] = (courseCounts[app.course] || 0) + 1;    

    });    if (approved.length === 0) {

            grid.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><h3>No approved students yet</h3></div>';

    const courses = Object.keys(courseCounts);        return;

    const counts = Object.values(courseCounts);    }

        

    canvas.chart = new Chart(ctx, {    grid.innerHTML = approved.map(app => `

        type: 'doughnut',        <div class="application-card">

        data: {            <div class="app-header">

            labels: courses,                <div class="app-avatar">${app.name.charAt(0).toUpperCase()}</div>

            datasets: [{                <span class="app-status approved">Approved</span>

                data: counts,            </div>

                backgroundColor: [            <div class="app-body">

                    '#667eea',                <h3 class="app-name">${app.name}</h3>

                    '#764ba2',                <div class="app-info">

                    '#f093fb',                    <div class="info-item"><i class="fas fa-envelope"></i> ${app.email}</div>

                    '#4facfe',                    <div class="info-item"><i class="fas fa-phone"></i> ${app.phone}</div>

                    '#43e97b'                    <div class="info-item"><i class="fas fa-graduation-cap"></i> ${app.course}</div>

                ]                    <div class="info-item"><i class="fas fa-check-circle"></i> Approved ${formatDate(app.approvedDate || app.appliedDate)}</div>

            }]                </div>

        },            </div>

        options: {            <div class="app-footer">

            responsive: true,                <button class="btn-action btn-view" onclick="viewApplication('${app.id}')">

            maintainAspectRatio: false,                    <i class="fas fa-eye"></i> View Details

            plugins: {                </button>

                legend: {            </div>

                    position: 'bottom'        </div>

                }    `).join('');

            }}

        }

    });function renderRejected() {

}    const grid = document.getElementById('rejectedGrid');

    const rejected = applications.filter(app => app.status === 'Rejected');

// ============================================    

// FILTERS    if (rejected.length === 0) {

// ============================================        grid.innerHTML = '<div class="empty-state"><i class="fas fa-times-circle"></i><h3>No rejected applications</h3></div>';

function initFilters() {        return;

    const tabBtns = document.querySelectorAll('.tab-btn');    }

    const searchInput = document.getElementById('searchInput');    

        grid.innerHTML = rejected.map(app => `

    tabBtns.forEach(btn => {        <div class="application-card">

        btn.addEventListener('click', function() {            <div class="app-header">

            tabBtns.forEach(b => b.classList.remove('active'));                <div class="app-avatar">${app.name.charAt(0).toUpperCase()}</div>

            this.classList.add('active');                <span class="app-status rejected">Rejected</span>

            renderApplications();            </div>

        });            <div class="app-body">

    });                <h3 class="app-name">${app.name}</h3>

                    <div class="app-info">

    if (searchInput) {                    <div class="info-item"><i class="fas fa-envelope"></i> ${app.email}</div>

        searchInput.addEventListener('input', function() {                    <div class="info-item"><i class="fas fa-phone"></i> ${app.phone}</div>

            const query = this.value.toLowerCase();                    <div class="info-item"><i class="fas fa-graduation-cap"></i> ${app.course}</div>

            const cards = document.querySelectorAll('.application-card');                    <div class="info-item"><i class="fas fa-times-circle"></i> Rejected ${formatDate(app.rejectedDate || app.appliedDate)}</div>

                            </div>

            cards.forEach(card => {            </div>

                const text = card.textContent.toLowerCase();            <div class="app-footer">

                card.style.display = text.includes(query) ? 'block' : 'none';                <button class="btn-action btn-view" onclick="viewApplication('${app.id}')">

            });                    <i class="fas fa-eye"></i> View Details

        });                </button>

    }            </div>

}        </div>

    `).join('');

// ============================================}

// UTILITY FUNCTIONS

// ============================================function renderRecentApplications() {

function formatDate(dateStr) {    const list = document.getElementById('recentApplicationsList');

    if (!dateStr) return 'N/A';    const recent = applications.slice(-5).reverse();

    const date = new Date(dateStr);    

    return date.toLocaleDateString('en-US', {     if (recent.length === 0) {

        year: 'numeric',         list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No recent applications</p></div>';

        month: 'short',         return;

        day: 'numeric'     }

    });    

}    list.innerHTML = recent.map(app => `

        <div class="recent-app-item">

function getTimeAgo(date) {            <div class="app-avatar" style="width: 45px; height: 45px; font-size: 1.2rem;">${app.name.charAt(0).toUpperCase()}</div>

    const seconds = Math.floor((new Date() - date) / 1000);            <div style="flex: 1;">

                    <div style="font-weight: 600; color: var(--dark);">${app.name}</div>

    const intervals = {                <div style="font-size: 0.875rem; color: var(--text-secondary);">${app.course}</div>

        year: 31536000,            </div>

        month: 2592000,            <span class="app-status ${app.status.toLowerCase()}" style="padding: 0.25rem 0.75rem; font-size: 0.7rem;">${app.status}</span>

        week: 604800,        </div>

        day: 86400,    `).join('');

        hour: 3600,}

        minute: 60

    };// Actions

    function viewApplication(id) {

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {    const app = applications.find(a => a.id === id);

        const interval = Math.floor(seconds / secondsInUnit);    if (!app) return;

        if (interval >= 1) {    

            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;    const modal = document.getElementById('detailModal');

        }    const content = document.getElementById('applicationDetailContent');

    }    

        content.innerHTML = `

    return 'Just now';        <div style="text-align: center; margin-bottom: 2rem;">

}            <div class="app-avatar" style="width: 80px; height: 80px; font-size: 2.5rem; margin: 0 auto 1rem;">${app.name.charAt(0).toUpperCase()}</div>

            <h2 style="margin-bottom: 0.5rem;">${app.name}</h2>

function getDeviceInfo() {            <span class="app-status ${app.status.toLowerCase()}">${app.status}</span>

    try {        </div>

        const stored = sessionStorage.getItem('deviceInfo');        <div style="display: grid; gap: 1.5rem; max-height: 60vh; overflow-y: auto; padding-right: 10px;">

        if (stored) return JSON.parse(stored);            <div>

    } catch (e) {}                <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Contact Information</div>

                    <div style="display: grid; gap: 0.75rem;">

    return {                    <div class="info-item"><i class="fas fa-envelope"></i> ${app.email || 'Not provided'}</div>

        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',                    <div class="info-item"><i class="fas fa-phone"></i> ${app.phone || 'Not provided'}</div>

        browser: getBrowserName(),                </div>

        platform: navigator.platform            </div>

    };            <div>

}                <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Course Details</div>

                <div class="info-item"><i class="fas fa-graduation-cap"></i> ${app.course || 'Not specified'}</div>

function getBrowserName() {            </div>

    const ua = navigator.userAgent;            ${app.paymentType || app.upiTransactionId ? `

    if (ua.includes('Firefox')) return 'Firefox';            <div>

    if (ua.includes('Chrome')) return 'Chrome';                <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Payment Information</div>

    if (ua.includes('Safari')) return 'Safari';                <div style="display: grid; gap: 0.75rem;">

    if (ua.includes('Edge')) return 'Edge';                    ${app.paymentType ? `<div class="info-item"><i class="fas fa-credit-card"></i> Payment Type: <strong>${app.paymentType}</strong></div>` : ''}

    return 'Unknown';                    ${app.upiTransactionId ? `<div class="info-item"><i class="fas fa-receipt"></i> UPI Transaction ID: <strong>${app.upiTransactionId}</strong></div>` : ''}

}                    ${app.paymentStatus ? `<div class="info-item"><i class="fas fa-wallet"></i> Payment Status: <span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; ${app.paymentStatus === 'Paid' ? 'background: #d1fae5; color: #065f46;' : app.paymentStatus === 'Installment' ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;'}">${app.paymentStatus}</span></div>` : ''}

                    ${app.paymentType && app.paymentType.toLowerCase().includes('installment') ? `<div class="info-item"><i class="fas fa-calendar-check"></i> Installments Paid: <strong>${app.installmentsPaid || 0} / ${app.totalInstallments || 2}</strong></div>` : ''}

function showToast(type, title, message) {                </div>

    console.log(`${type.toUpperCase()}: ${title} - ${message}`);            </div>

                ` : ''}

    // Create toast element            ${app.yearOfStudy ? `

    const toast = document.createElement('div');            <div>

    toast.className = `toast toast-${type}`;                <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Academic Information</div>

    toast.innerHTML = `                <div style="display: grid; gap: 0.75rem;">

        <div class="toast-content">                    <div class="info-item"><i class="fas fa-calendar-alt"></i> Year: ${app.yearOfStudy}</div>

            <strong>${title}</strong>                    ${app.branch ? `<div class="info-item"><i class="fas fa-code-branch"></i> Branch: ${app.branch}</div>` : ''}

            <p>${message}</p>                    ${app.preferredDomain ? `<div class="info-item"><i class="fas fa-star"></i> Preferred Domain: ${app.preferredDomain}</div>` : ''}

        </div>                </div>

        <button class="toast-close">&times;</button>            </div>

    `;            ` : ''}

                ${app.technicalSkills ? `

    document.body.appendChild(toast);            <div>

                    <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Technical Skills</div>

    setTimeout(() => toast.classList.add('show'), 100);                <div class="info-item" style="white-space: pre-wrap;"><i class="fas fa-laptop-code"></i> ${app.technicalSkills}</div>

                </div>

    const closeBtn = toast.querySelector('.toast-close');            ` : ''}

    closeBtn.addEventListener('click', () => {            ${app.goals ? `

        toast.classList.remove('show');            <div>

        setTimeout(() => toast.remove(), 300);                <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Goals & Objectives</div>

    });                <div class="info-item" style="white-space: pre-wrap;"><i class="fas fa-bullseye"></i> ${app.goals}</div>

                </div>

    setTimeout(() => {            ` : ''}

        toast.classList.remove('show');            ${app.financialSupport ? `

        setTimeout(() => toast.remove(), 300);            <div>

    }, 5000);                <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Financial Support</div>

}                <div class="info-item" style="white-space: pre-wrap;"><i class="fas fa-hand-holding-usd"></i> ${app.financialSupport}</div>

            </div>

function setupToastClose() {            ` : ''}

    document.addEventListener('click', (e) => {            <div>

        if (e.target.classList.contains('toast-close')) {                <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Application Date</div>

            const toast = e.target.closest('.toast');                <div class="info-item"><i class="fas fa-calendar"></i> ${new Date(app.appliedDate).toLocaleString()}</div>

            if (toast) {            </div>

                toast.classList.remove('show');            ${app.status === 'Pending' ? `

                setTimeout(() => toast.remove(), 300);                <div style="display: flex; gap: 1rem; margin-top: 1rem;">

            }                    <button class="btn-action btn-approve" style="flex: 1;" onclick="approveApplication('${app.id}'); document.getElementById('detailModal').classList.remove('show');">

        }                        <i class="fas fa-check"></i> Approve

    });                    </button>

}                    <button class="btn-action btn-reject" style="flex: 1;" onclick="rejectApplication('${app.id}'); document.getElementById('detailModal').classList.remove('show');">

                        <i class="fas fa-times"></i> Reject

function addRippleEffect() {                    </button>

    document.querySelectorAll('button, .btn').forEach(button => {                </div>

        button.addEventListener('click', function(e) {            ` : ''}

            const ripple = document.createElement('span');        </div>

            ripple.classList.add('ripple');    `;

                

            const rect = this.getBoundingClientRect();    modal.classList.add('show');

            const x = e.clientX - rect.left;}

            const y = e.clientY - rect.top;

            function approveApplication(id) {

            ripple.style.left = x + 'px';    const app = applications.find(a => a.id === id);

            ripple.style.top = y + 'px';    if (!app) return;

                

            this.appendChild(ripple);    // Payment confirmation dialog

                let paymentConfirmed = false;

            setTimeout(() => ripple.remove(), 600);    let paymentDetails = '';

        });    

    });    if (app.paymentType && app.paymentType.toLowerCase().includes('installment')) {

}        // Installment payment

        const installmentAmount = prompt(

function addTooltips() {            `Approve ${app.name}'s application?\n\n` +

    document.querySelectorAll('[data-tooltip]').forEach(element => {            `Payment Type: ${app.paymentType}\n` +

        element.addEventListener('mouseenter', function() {            `Current Installments Paid: ${app.installmentsPaid || 0} / ${app.totalInstallments || 2}\n\n` +

            const tooltip = document.createElement('div');            `Enter installment amount received (or cancel):`

            tooltip.className = 'tooltip';        );

            tooltip.textContent = this.getAttribute('data-tooltip');        

            document.body.appendChild(tooltip);        if (installmentAmount !== null && installmentAmount.trim() !== '') {

                        app.installmentsPaid = (app.installmentsPaid || 0) + 1;

            const rect = this.getBoundingClientRect();            app.paymentAmount = installmentAmount;

            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';            app.paymentStatus = app.installmentsPaid >= app.totalInstallments ? 'Paid' : 'Installment';

            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';            paymentConfirmed = true;

        });            paymentDetails = `Installment ${app.installmentsPaid}/${app.totalInstallments}: ₹${installmentAmount}`;

                } else {

        element.addEventListener('mouseleave', function() {            return; // Cancelled

            document.querySelectorAll('.tooltip').forEach(t => t.remove());        }

        });    } else {

    });        // Full payment

}        const paymentAmount = prompt(

            `Approve ${app.name}'s application?\n\n` +

function createConfetti() {            `Payment Type: ${app.paymentType || 'Full Payment'}\n` +

    for (let i = 0; i < 50; i++) {            `${app.upiTransactionId ? 'UPI Transaction ID: ' + app.upiTransactionId : ''}\n\n` +

        const confetti = document.createElement('div');            `Confirm full payment amount received:`

        confetti.className = 'confetti';        );

        confetti.style.left = Math.random() * 100 + '%';        

        confetti.style.animationDelay = Math.random() * 3 + 's';        if (paymentAmount !== null && paymentAmount.trim() !== '') {

        confetti.style.backgroundColor = ['#667eea', '#764ba2', '#f093fb', '#43e97b'][Math.floor(Math.random() * 4)];            app.paymentAmount = paymentAmount;

        document.body.appendChild(confetti);            app.paymentStatus = 'Paid';

                    paymentConfirmed = true;

        setTimeout(() => confetti.remove(), 3000);            paymentDetails = `Full Payment: ₹${paymentAmount}`;

    }        } else {

}            return; // Cancelled

        }

console.log('📦 App.js loaded (Clean Version)');    }

    
    if (paymentConfirmed) {
        app.status = 'Approved';
        app.approvedDate = new Date().toISOString();
        
        // Get device info for logging
        const deviceInfo = JSON.parse(sessionStorage.getItem('deviceInfo') || '{}');
        app.approvedBy = {
            username: sessionStorage.getItem('adminUsername') || 'Admin',
            device: deviceInfo.deviceType || 'Unknown',
            browser: deviceInfo.browser || 'Unknown',
            timestamp: new Date().toISOString()
        };
        
        saveData();
        
        console.log('💾 Saving approved application to Supabase...', app.name);
        
        // Save to Supabase tables
        if (typeof saveApprovedApplication === 'function') {
            console.log('📞 Calling saveApprovedApplication...');
            saveApprovedApplication(app).then(result => {
                console.log('✅ saveApprovedApplication result:', result);
            }).catch(err => {
                console.error('❌ saveApprovedApplication error:', err);
            });
        } else {
            console.error('❌ saveApprovedApplication function not found!');
        }
        
        if (typeof savePaymentTransaction === 'function') {
            console.log('📞 Calling savePaymentTransaction...');
            savePaymentTransaction(app).then(result => {
                console.log('✅ savePaymentTransaction result:', result);
            }).catch(err => {
                console.error('❌ savePaymentTransaction error:', err);
            });
        } else {
            console.error('❌ savePaymentTransaction function not found!');
        }
        
        // Also save to main applications table
        if (typeof saveToSupabase === 'function') {
            console.log('📞 Calling saveToSupabase...');
            saveToSupabase(app).then(result => {
                console.log('✅ saveToSupabase result:', result);
            }).catch(err => {
                console.error('❌ saveToSupabase error:', err);
            });
        }
        
        // Log the approval action with details
        addAdminLog('success', '✅ Application Approved', 
            `${app.name} • ${app.course} • ${paymentDetails} • From ${deviceInfo.deviceType || 'Desktop'}`);
        
        // Send Email & SMS (simulated)
        sendApprovalNotification(app);
        
        // Haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
        
        // Confetti celebration!
        createConfetti();
        
        // Show success toast with payment info
        showToast('success', 'Application Approved!', 
            `${app.name} approved!\n${paymentDetails}\nEmail & SMS sent.`);
        
        // Force immediate UI update
        setTimeout(() => {
            updateAllStats();
            renderApplications();
            renderRecentApplications();
            updateCharts();
            addTooltips();
        }, 100);
    }
}

function rejectApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    // Show detailed confirmation dialog with application info
    const dialogMessage = `
REJECT APPLICATION

Student: ${app.name}
Email: ${app.email}
Phone: ${app.phone}
Course: ${app.course}
${app.upiTransactionId ? 'Transaction ID: ' + app.upiTransactionId : ''}

Do you want to preview the rejection email before sending?
Click OK to preview, or Cancel to skip preview and reject immediately.
    `.trim();
    
    if (confirm(dialogMessage)) {
        // Preview email first
        previewEmail(app, 'reject');
    } else {
        // Reject immediately with reason prompt
        const reason = prompt(`Enter rejection reason for ${app.name}:`);
        if (reason !== null) {
            rejectApplicationWithReason(id, reason);
        }
    }
}

function rejectApplicationWithReason(id, reason) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    app.status = 'Rejected';
    app.rejectedDate = new Date().toISOString();
    app.rejectionReason = reason || 'Not specified';
    
    // Get device info for logging
    const deviceInfo = JSON.parse(sessionStorage.getItem('deviceInfo') || '{}');
    app.rejectedBy = {
        username: sessionStorage.getItem('adminUsername') || 'Admin',
        device: deviceInfo.deviceType || 'Unknown',
        browser: deviceInfo.browser || 'Unknown',
        timestamp: new Date().toISOString()
    };
    
    saveData();
    
    // Save to Supabase rejected_applications table
    if (typeof saveRejectedApplication === 'function') {
        saveRejectedApplication(app);
    }
    
    // Send rejection notification
    sendRejectionNotification(app);
    
    // Log activity with device info
    addAdminLog('error', '❌ Application Rejected', 
        `${app.name} • ${app.course} • Reason: ${reason} • From ${deviceInfo.deviceType || 'Desktop'}`);
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // Show toast
    showToast('error', 'Application Rejected', `${app.name}'s application has been rejected and notified.`);
    
    // Force immediate UI update
    setTimeout(() => {
        updateAllStats();
        renderApplications();
        renderRecentApplications();
        updateCharts();
    }, 100);
}

// Notifications (Simulated Email/SMS)
async function sendApprovalNotification(app) {
    addAdminLog('info', 'Sending Approval Email', `Sending to ${app.email}...`);
    
    // Send real email via Brevo API
    if (typeof window.sendApprovalEmail === 'function') {
        try {
            const result = await window.sendApprovalEmail(
                app.email,
                app.name,
                app.upiTransactionId || app.id,
                app.course || '',
                'approve'
            );
            
            if (result.success) {
                console.log('✅ Approval email sent to:', app.email);
                addAdminLog('success', 'Email Sent Successfully', `✅ Approval email sent to ${app.name} (${app.email})`);
            } else {
                console.warn('⚠️ Email sending failed:', result.error);
                addAdminLog('error', 'Email Failed', `❌ Failed to send to ${app.email}: ${result.error}`);
            }
        } catch (error) {
            console.error('❌ Error sending email:', error);
            addAdminLog('error', 'Email Error', `❌ Error sending to ${app.email}: ${error.message}`);
        }
    } else {
        console.warn('⚠️ Email function not available. Make sure sheets-integration.js is loaded.');
        addAdminLog('warning', 'Email Function Unavailable', 'sheets-integration.js not loaded');
    }
}

function sendRejectionNotification(app) {
    addAdminLog('info', 'Sending Rejection Email', `Sending to ${app.email}...`);
    
    // Send rejection email using Netlify function (uses reject template)
    if (typeof window.sendApprovalEmail === 'function') {
        window.sendApprovalEmail(
            app.email,
            app.name,
            app.upiTransactionId || app.id,
            app.course || '',
            'reject',
            app.rejectionReason || ''
        ).then(result => {
            if (result && result.success) {
                console.log('✅ Rejection email sent to:', app.email);
                addAdminLog('success', 'Rejection Email Sent', `✅ Email sent to ${app.name} (${app.email})`);
            } else {
                console.warn('⚠️ Rejection email failed:', result && result.error);
                addAdminLog('error', 'Email Failed', `❌ Failed to send rejection email: ${result && result.error}`);
            }
        }).catch(err => {
            console.error('❌ Error sending rejection email:', err);
            addAdminLog('error', 'Email Error', `❌ Error: ${err.message}`);
        });
    } else {
        console.warn('⚠️ Email function not available. Make sure sheets-integration.js is loaded.');
        addAdminLog('warning', 'Email Function Unavailable', 'sheets-integration.js not loaded');
    }
}

// Toast Notification
let toastTimeout = null;
function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    
    // Clear any existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toastTimeout = null;
    }
    
    // Remove show class first to reset animation
    toast.classList.remove('show');
    
    // Small delay to allow reset
    setTimeout(() => {
        toast.className = `toast ${type}`;
        toast.querySelector('.toast-title').textContent = title;
        toast.querySelector('.toast-message').textContent = message;
        toast.classList.add('show');
        
        // Auto-dismiss after 4 seconds
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toastTimeout = null;
        }, 4000);
    }, 50);
}

function setupToastClose() {
    document.querySelector('.toast-close')?.addEventListener('click', function() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
        
        // Clear timeout when manually closed
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toastTimeout = null;
        }
    });
}

// Modal Close
document.getElementById('closeDetailModal')?.addEventListener('click', function() {
    document.getElementById('detailModal').classList.remove('show');
});

document.getElementById('detailModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

// Filters
function initFilters() {
    // Tab filters
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderApplications(filter);
        });
    });
    
    // Search filters
    document.getElementById('searchApplications')?.addEventListener('input', function() {
        filterApplications(this.value);
    });
    
    document.getElementById('searchApproved')?.addEventListener('input', function() {
        filterApproved(this.value);
    });
    
    document.getElementById('searchRejected')?.addEventListener('input', function() {
        filterRejected(this.value);
    });
    
    document.getElementById('filterCourseApp')?.addEventListener('change', function() {
        filterApplicationsByCourse(this.value);
    });
}

function filterApplications(searchTerm) {
    const filtered = applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm)
    );
    
    const grid = document.getElementById('applicationsGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No results found</h3></div>';
    } else {
        renderApplications();
    }
}

function filterApplicationsByCourse(course) {
    const grid = document.getElementById('applicationsGrid');
    const filtered = course ? applications.filter(app => app.course === course) : applications;
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No applications for this course</h3></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(app => `
        <div class="application-card">
            <div class="app-header">
                <div class="app-avatar">${app.name.charAt(0).toUpperCase()}</div>
                <span class="app-status ${app.status.toLowerCase()}">${app.status}</span>
            </div>
            <div class="app-body">
                <h3 class="app-name">${app.name}</h3>
                <div class="app-info">
                    <div class="info-item"><i class="fas fa-envelope"></i> ${app.email}</div>
                    <div class="info-item"><i class="fas fa-phone"></i> ${app.phone}</div>
                    <div class="info-item"><i class="fas fa-graduation-cap"></i> ${app.course}</div>
                    <div class="info-item"><i class="fas fa-calendar"></i> ${formatDate(app.appliedDate)}</div>
                </div>
            </div>
            <div class="app-footer">
                <button class="btn-action btn-view" onclick="viewApplication('${app.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                ${app.status === 'Pending' ? `
                    <button class="btn-action btn-approve" onclick="approveApplication('${app.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-action btn-reject" onclick="rejectApplication('${app.id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Charts
function initCharts() {
    initApplicationTrendChart();
    initCourseDistributionChart();
    initApplicationStatsChart();
    initStatusDistributionChart();
    initWeeklyFlowChart();
}

function updateCharts() {
    const charts = [
        window.applicationTrendChart,
        window.courseDistributionChart,
        window.applicationStatsChart,
        window.statusDistributionChart,
        window.weeklyFlowChart
    ];
    
    charts.forEach(chart => {
        if (chart) chart.destroy();
    });
    
    initCharts();
}

function initApplicationTrendChart() {
    const ctx = document.getElementById('applicationTrendChart');
    if (!ctx) return;
    
    // Group by date
    const dates = {};
    applications.forEach(app => {
        const date = new Date(app.appliedDate).toLocaleDateString();
        dates[date] = (dates[date] || 0) + 1;
    });
    
    const sortedDates = Object.keys(dates).sort((a, b) => new Date(a) - new Date(b));
    const counts = sortedDates.map(date => dates[date]);
    
    window.applicationTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates.length > 0 ? sortedDates : ['No Data'],
            datasets: [{
                label: 'Applications',
                data: counts.length > 0 ? counts : [0],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });
}

function initCourseDistributionChart() {
    const ctx = document.getElementById('courseDistributionChart');
    if (!ctx) return;
    
    const courses = {};
    applications.forEach(app => {
        courses[app.course] = (courses[app.course] || 0) + 1;
    });
    
    window.courseDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(courses),
            datasets: [{
                data: Object.values(courses),
                backgroundColor: ['#6366f1', '#ec4899', '#3b82f6', '#10b981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function initApplicationStatsChart() {
    const ctx = document.getElementById('applicationStatsChart');
    if (!ctx) return;
    
    const pending = applications.filter(app => app.status === 'Pending').length;
    const approved = applications.filter(app => app.status === 'Approved').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;
    
    window.applicationStatsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pending', 'Approved', 'Rejected'],
            datasets: [{
                label: 'Count',
                data: [pending, approved, rejected],
                backgroundColor: ['#f59e0b', '#10b981', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });
}

function initStatusDistributionChart() {
    const ctx = document.getElementById('statusDistributionChart');
    if (!ctx) return;
    
    const pending = applications.filter(app => app.status === 'Pending').length;
    const approved = applications.filter(app => app.status === 'Approved').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;
    
    window.statusDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pending', 'Approved', 'Rejected'],
            datasets: [{
                data: [pending, approved, rejected],
                backgroundColor: ['#f59e0b', '#10b981', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function initWeeklyFlowChart() {
    const ctx = document.getElementById('weeklyFlowChart');
    if (!ctx) return;
    
    // Last 7 days
    const days = [];
    const pendingData = [];
    const approvedData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        days.push(dateStr);
        
        pendingData.push(applications.filter(app => 
            new Date(app.appliedDate).toLocaleDateString() === dateStr && app.status === 'Pending'
        ).length);
        
        approvedData.push(applications.filter(app => 
            new Date(app.appliedDate).toLocaleDateString() === dateStr && app.status === 'Approved'
        ).length);
    }
    
    window.weeklyFlowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Pending',
                    data: pendingData,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Approved',
                    data: approvedData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) return date.toLocaleDateString();
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

// Sample Data (Fallback only if no Google Sheets data)
function getSampleApplications() {
    return [];
}

// ==============================================
// PAYMENT HISTORY FUNCTIONS
// ==============================================

function renderPaymentHistory() {
    const paymentList = document.getElementById('paymentHistoryList');
    if (!paymentList) return;
    
    const filter = document.getElementById('paymentStatusFilter')?.value || 'all';
    
    // Filter approved applications with payment info
    const paidApplications = applications.filter(app => 
        app.status === 'Approved' && 
        (app.paymentAmount || app.paymentType) &&
        (filter === 'all' || app.paymentStatus === filter)
    );
    
    if (paidApplications.length === 0) {
        paymentList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-receipt" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>No payment records found</p>
            </div>
        `;
        return;
    }
    
    paymentList.innerHTML = paidApplications.map(app => {
        const isInstallment = app.paymentType && app.paymentType.toLowerCase().includes('installment');
        const paymentIcon = isInstallment ? 'fa-calendar-check' : 'fa-check-circle';
        const statusColor = app.paymentStatus === 'Paid' ? '#10b981' : app.paymentStatus === 'Installment' ? '#f59e0b' : '#ef4444';
        
        return `
            <div class="payment-item" style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; background: white; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid ${statusColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${statusColor}20; display: flex; align-items: center; justify-content: center; color: ${statusColor};">
                            <i class="fas ${paymentIcon}"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; font-size: 16px; font-weight: 600;">${app.name}</h4>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--text-secondary);">
                                <i class="fas fa-envelope"></i> ${app.email}
                                ${app.phone ? `<span style="margin-left: 12px;"><i class="fas fa-phone"></i> ${app.phone}</span>` : ''}
                            </p>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1rem;">
                        <div>
                            <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Course</span>
                            <p style="margin: 4px 0 0 0; font-weight: 500;">${app.course}</p>
                        </div>
                        <div>
                            <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Payment Type</span>
                            <p style="margin: 4px 0 0 0; font-weight: 500;">${app.paymentType || 'Full Payment'}</p>
                        </div>
                        ${app.upiTransactionId ? `
                        <div>
                            <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Transaction ID</span>
                            <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 13px;">${app.upiTransactionId}</p>
                        </div>
                        ` : ''}
                        ${isInstallment ? `
                        <div>
                            <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Installments</span>
                            <p style="margin: 4px 0 0 0; font-weight: 500;">${app.installmentsPaid || 0} / ${app.totalInstallments || 2} Paid</p>
                        </div>
                        ` : ''}
                        <div>
                            <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Approved Date</span>
                            <p style="margin: 4px 0 0 0; font-size: 13px;">${new Date(app.approvedDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <div style="text-align: right; margin-left: 1.5rem;">
                    <div style="font-size: 24px; font-weight: 700; color: ${statusColor};">
                        ${app.paymentAmount ? '₹' + app.paymentAmount : '-'}
                    </div>
                    <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${statusColor}20; color: ${statusColor};">
                        ${app.paymentStatus || 'Pending'}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // Update payment stats
    updatePaymentStats();
}

function updatePaymentStats() {
    const approvedApps = applications.filter(app => app.status === 'Approved');
    
    const fullPayments = approvedApps.filter(app => app.paymentStatus === 'Paid').length;
    const installmentPayments = approvedApps.filter(app => app.paymentStatus === 'Installment').length;
    const totalRevenue = approvedApps
        .filter(app => app.paymentAmount)
        .reduce((sum, app) => sum + (parseFloat(app.paymentAmount) || 0), 0);
    
    const fullPaymentElem = document.getElementById('totalPaidPayments');
    const installmentElem = document.getElementById('totalInstallmentPayments');
    const revenueElem = document.getElementById('totalRevenue');
    
    if (fullPaymentElem) animateValue(fullPaymentElem, fullPayments);
    if (installmentElem) animateValue(installmentElem, installmentPayments);
    if (revenueElem) {
        let start = 0;
        const duration = 800;
        const startTime = performance.now();
        
        function animateRevenue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(totalRevenue * progress);
            revenueElem.textContent = '₹' + current.toLocaleString();
            if (progress < 1) requestAnimationFrame(animateRevenue);
        }
        requestAnimationFrame(animateRevenue);
    }
}

// Add payment filter listener
document.addEventListener('DOMContentLoaded', function() {
    const paymentFilter = document.getElementById('paymentStatusFilter');
    if (paymentFilter) {
        paymentFilter.addEventListener('change', renderPaymentHistory);
    }
});

