/**
 * Infinity Tech - Dynamic Theme Color Switcher on Refresh
 * Cycles through 4 curated premium theme palettes whenever the user refreshes the page.
 */
(function() {
    const themes = [
        {
            name: "Cyber Electric Blue & Cyan",
            primary: "#00E5FF",
            primaryDark: "#0D43FE",
            gradient: "linear-gradient(135deg, #00E5FF 0%, #0D43FE 100%)",
            textAccent: "#00E5FF",
            badgeBg: "rgba(0, 229, 255, 0.15)",
            svgStroke: "#00E5FF"
        },
        {
            name: "Royal Violet & Electric Indigo",
            primary: "#A855F7",
            primaryDark: "#6366F1",
            gradient: "linear-gradient(135deg, #C084FC 0%, #6366F1 100%)",
            textAccent: "#C084FC",
            badgeBg: "rgba(168, 85, 247, 0.15)",
            svgStroke: "#A855F7"
        },
        {
            name: "Emerald Mint & Neo Green",
            primary: "#10B981",
            primaryDark: "#047857",
            gradient: "linear-gradient(135deg, #34D399 0%, #059669 100%)",
            textAccent: "#34D399",
            badgeBg: "rgba(16, 185, 129, 0.15)",
            svgStroke: "#10B981"
        },
        {
            name: "Sunset Coral & Amber Gold",
            primary: "#F59E0B",
            primaryDark: "#EA580C",
            gradient: "linear-gradient(135deg, #FBBF24 0%, #F97316 100%)",
            textAccent: "#FBBF24",
            badgeBg: "rgba(245, 158, 11, 0.15)",
            svgStroke: "#F59E0B"
        }
    ];

    // Pick a random theme or cycle on refresh
    let lastIndex = parseInt(sessionStorage.getItem('infinity_theme_index') || '-1', 10);
    let newIndex = Math.floor(Math.random() * themes.length);
    if (newIndex === lastIndex) {
        newIndex = (newIndex + 1) % themes.length;
    }
    sessionStorage.setItem('infinity_theme_index', newIndex);

    const t = themes[newIndex];

    // Inject Dynamic Theme CSS Style Tag into <head>
    const styleElem = document.createElement('style');
    styleElem.id = 'dynamic-theme-stylesheet';
    styleElem.innerHTML = `
        /* Dynamic Theme Palette Override: ${t.name} */
        :root {
            --vl-theme-primary: ${t.primary} !important;
            --vl-theme-gradient: ${t.gradient} !important;
            --vl-theme-text-accent: ${t.textAccent} !important;
        }

        /* Buttons & Badges */
        .theme-btn, .theme-btn2, .vl-iner-btn, .readmore span, .blu-bg, #wa-fab-trigger, #wa-send-btn {
            background: ${t.gradient} !important;
            color: #FFFFFF !important;
            border-color: transparent !important;
        }

        /* Hover glows & border highlights */
        .vl-pricing-box.active, .vl-service-icon-box-4:hover, .vl-about-icon-box-4:hover {
            border-color: ${t.primary} !important;
            box-shadow: 0 10px 30px ${t.badgeBg} !important;
        }

        /* Subtitles & Accents */
        .vl-section-subtitle-6, .vl-section-subtitle-7, .vl-section-subtitle-4 {
            color: ${t.textAccent} !important;
        }

        /* Icon Highlights */
        .fa-check, .fa-arrow-right, .fa-angle-right, .fa-location-dot, .fa-phone, .fa-envelope, .fa-clock {
            color: ${t.textAccent} !important;
        }

        /* SVGs and Logos */
        .logo-text {
            color: ${t.textAccent} !important;
        }

        /* Footer Social Media Badges */
        .vl-footer-social-4 ul li a {
            background: ${t.badgeBg} !important;
            border: 1px solid ${t.primary} !important;
        }
        .vl-footer-social-4 ul li a i {
            color: ${t.textAccent} !important;
        }

        /* Dynamic SVG strokes for logo */
        .vl-logo-brand img, .wa-avatar-img {
            filter: drop-shadow(0 0 6px ${t.primary});
        }
    `;

    document.head.appendChild(styleElem);
    console.log("🎨 Dynamic Theme Activated: " + t.name);
})();
