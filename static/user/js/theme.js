(function () {
    const root = document.documentElement;

    // Default theme
    if (!localStorage.getItem('webryx-theme')) {
        localStorage.setItem('webryx-theme', 'light');
    }

    // Apply immediately (prevents flash)
    const saved = localStorage.getItem('webryx-theme');
    root.setAttribute('data-theme', saved);

    function setupThemeToggle() {
        const btn = document.getElementById('themeToggle');
        const icon = document.getElementById('themeIcon');

        if (!btn) {
            // Retry if navbar not loaded yet
            setTimeout(setupThemeToggle, 100);
            return;
        }

        function syncIcon(theme) {
            if (!icon) return;
            icon.className = theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon';
        }

        syncIcon(root.getAttribute('data-theme'));

        btn.onclick = function () {
            const current = root.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';

            root.setAttribute('data-theme', next);
            localStorage.setItem('webryx-theme', next);
            syncIcon(next);
        };
    }

    // Run after DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupThemeToggle);
    } else {
        setupThemeToggle();
    }

})();