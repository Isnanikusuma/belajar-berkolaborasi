import StoryModel from './model/storyModel.js';
import StoryView from './view/storyView.js';
import StoryPresenter from './presenter/storyPresenter.js';


document.addEventListener('DOMContentLoaded', () => {
    const model = new StoryModel();
    const view = new StoryView();
    const presenter = new StoryPresenter(model, view);
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered: ', reg))
            .catch(err => console.error('SW registration failed: ', err));
    });
}
