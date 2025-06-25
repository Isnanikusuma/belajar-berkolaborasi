export default class StoryPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href === '#' && e.target.id === 'logout-btn') {
                    this.handleLogout();
                } else if (href?.startsWith('#')) {
                    const pageId = href.substring(1) + '-page';
                    this.view.showPage(pageId);

                    if (pageId === 'stories-page') this.loadStories();
                    else if (pageId === 'add-story-page') {
                        this.view.initializeAddStoryMap();
                        this.view.initializeCamera();
                    }
                }
            }
        });

        document.addEventListener('submit', (e) => {
            e.preventDefault();
            if (e.target.id === 'login-form') this.handleLogin(e.target);
            else if (e.target.id === 'register-form') this.handleRegister(e.target);
            else if (e.target.id === 'add-story-form') this.handleAddStory(e.target);
        });
    }

    checkAuthStatus() {
        if (this.model.isLoggedIn()) {
    this.view.renderNavLinks(true);         // Tambah ini
    this.view.showPage('stories-page');
    this.loadStories();
  } else {
    this.view.renderNavLinks(false);        // Tambah ini
    this.view.showPage('login-page');
  }
    }

    async handleLogin(form) {
        const email = form.email.value;
        const password = form.password.value;
        if (!email || !password) return this.view.showAlert('Email dan password harus diisi', 'error');

        try {
            this.view.showLoading(true);
            await this.model.login(email, password);
            this.view.showAlert('Login berhasil!', 'success');
            this.view.showPage('stories-page');
            this.loadStories();
        } catch (err) {
            this.view.showAlert('Login gagal: ' + err.message, 'error');
        } finally {
            this.view.showLoading(false);
        }
    }

    async handleRegister(form) {
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        if (!name || !email || !password) return this.view.showAlert('Semua field harus diisi', 'error');
        if (password.length < 8) return this.view.showAlert('Password minimal 8 karakter', 'error');

        try {
            this.view.showLoading(true);
            await this.model.register(name, email, password);
            this.view.showAlert('Registrasi berhasil! Silakan login.', 'success');
            this.view.showPage('login-page');
            form.reset();
        } catch (err) {
            this.view.showAlert('Registrasi gagal: ' + err.message, 'error');
        } finally {
            this.view.showLoading(false);
        }
    }

    async loadStories() {
        try {
            this.view.showLoading(true);
            const stories = await this.model.getStories();
            this.view.renderStories(stories);
        } catch (err) {
            this.view.showAlert('Gagal memuat cerita: ' + err.message, 'error');
        } finally {
            this.view.showLoading(false);
        }
    }

    async handleAddStory(form) {
        const description = form.description.value;
        const lat = form.lat.value;
        const lon = form.lon.value;

        if (!description) return this.view.showAlert('Deskripsi harus diisi', 'error');
        if (!this.view.capturedPhotoBlob) return this.view.showAlert('Foto harus diambil atau dipilih', 'error');

        try {
            this.view.showLoading(true);
            await this.model.addStory(description, this.view.capturedPhotoBlob, lat || null, lon || null);
            this.view.showAlert('Cerita berhasil ditambahkan!', 'success');
            this.view.resetAddStoryForm();
            this.view.showPage('stories-page');
            this.loadStories();
        } catch (err) {
            this.view.showAlert('Gagal menambahkan cerita: ' + err.message, 'error');
        } finally {
            this.view.showLoading(false);
        }
    }

    async handleStoryDetail(id) {
    try {
        this.view.showLoading(true);
        const story = await this.model.getStoryDetail(id);
        this.view.renderStoryDetail(story);
        this.view.showPage('story-detail-page');
    } catch (error) {
        this.view.showAlert('Gagal memuat detail cerita: ' + error.message, 'error');
    } finally {
        this.view.showLoading(false);
    }
}


    handleLogout() {
        this.model.logout();
        this.view.showAlert('Logout berhasil', 'success');
        this.view.showPage('login-page');
    }
}
