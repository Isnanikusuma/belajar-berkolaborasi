export default class StoryModel {
    constructor() {
        this.baseUrl = 'https://story-api.dicoding.dev/v1';
        this.token = localStorage.getItem('token') || null;
    }

    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.message);
        this.token = data.loginResult.token;
        localStorage.setItem('token', this.token);
        return data;
    }

    async register(name, email, password) {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.message);
        return data;
    }

    async getStories() {
        const response = await fetch(`${this.baseUrl}/stories`, {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        const data = await response.json();
        if (data.error) throw new Error(data.message);
        return data.listStory;
    }

    async getStoryDetail(id) {
    try {
        const response = await fetch(`${this.baseUrl}/stories/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        const data = await response.json();

        if (data.error) {
            throw new Error(data.message);
        }

        return data.story;
    } catch (error) {
        throw error;
    }
}


    async addStory(description, photo, lat, lon) {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photo);
        if (lat && lon) {
            formData.append('lat', lat);
            formData.append('lon', lon);
        }

        const response = await fetch(`${this.baseUrl}/stories`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.token}` },
            body: formData
        });
        const data = await response.json();
        if (data.error) throw new Error(data.message);
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    isLoggedIn() {
        return !!this.token;
    }
}
