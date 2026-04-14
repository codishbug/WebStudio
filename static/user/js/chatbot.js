

document.addEventListener("DOMContentLoaded", function () {

    /* ── Elements ── */
    const popup    = document.getElementById("chatbot-popup");
    const overlay  = document.getElementById("chatbot-overlay");
    const chatBody = document.getElementById("chat-body");
    const chatBtn  = document.getElementById("chatbot-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const badge    = document.getElementById("chatbot-badge");

    if (!popup || !chatBody || !chatBtn) return; // safety guard

    /* ── Open / Close ── */
    let isOpen = false;

    function openChat() {
        isOpen = true;
        popup.classList.add("active");
        if (overlay) overlay.classList.add("active");
        chatBtn.classList.add("chat-open");

        // Hide badge
        if (badge) badge.style.display = "none";

        // Show intro on first open
        if (chatBody.innerHTML.trim() === "") {
            setTimeout(showMainMenu, 220);
        }

        // Trap focus inside panel
        popup.focus?.();
    }

    function closeChat() {
        isOpen = false;
        popup.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        chatBtn.classList.remove("chat-open");
    }

    window.toggleChat = function () {
        isOpen ? closeChat() : openChat();
    };

    chatBtn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleChat();
    });

    if (closeBtn) closeBtn.addEventListener("click", closeChat);

    // Close on overlay click
    if (overlay) overlay.addEventListener("click", closeChat);

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isOpen) closeChat();
    });

    /* ── Scroll ── */
    function scrollBottom() {
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }

    /* ── Messages ── */
    function addMessage(text, delay = 0) {
        return new Promise(resolve => {
            // Typing indicator
            const typing = document.createElement("div");
            typing.className = "typing-indicator";
            typing.innerHTML = "<span></span><span></span><span></span>";
            chatBody.appendChild(typing);
            scrollBottom();

            setTimeout(() => {
                typing.remove();
                const msg = document.createElement("div");
                msg.className = "bot-message";
                msg.innerHTML = text;
                chatBody.appendChild(msg);
                scrollBottom();
                resolve();
            }, delay || 550);
        });
    }

    function addUserMessage(text) {
        const msg = document.createElement("div");
        msg.className = "user-message";
        msg.textContent = text;
        chatBody.appendChild(msg);
        scrollBottom();
    }

    function addDivider(label = "Today") {
        const div = document.createElement("div");
        div.className = "chat-divider";
        div.textContent = label;
        chatBody.appendChild(div);
    }

    function addButtons(buttons) {
        const wrapper = document.createElement("div");
        wrapper.className = "chat-options";

        buttons.forEach(btn => {
            const button = document.createElement("button");
            button.className = "chat-button";
            button.innerHTML = `<i class="${btn.icon}"></i> ${btn.text}`;
            button.dataset.action = btn.action;
            wrapper.appendChild(button);
        });

        chatBody.appendChild(wrapper);
        scrollBottom();
    }

    /* ── Button delegation ── */
    chatBody.addEventListener("click", function (e) {
        const button = e.target.closest(".chat-button");
        if (!button) return;

        const action = button.dataset.action;
        const label  = button.querySelector("i") ? button.innerText.trim() : button.textContent.trim();

        // Remove options immediately
        const wrapper = button.closest(".chat-options");
        if (wrapper) wrapper.remove();

        addUserMessage(label);

        if (typeof window[action] === "function") {
            setTimeout(() => window[action](), 280);
        }
    });

    /* ════════════════════════════════════
       MENU DEFINITIONS
    ════════════════════════════════════ */

    /* Main menu */
    window.showMainMenu = async function () {
        addDivider();
        await addMessage("👋 Hey there! Welcome to <strong>WebStudio Support</strong>.<br>How can I help you today?");

        addButtons([
            { text: "Download Template", icon: "fa fa-download",      action: "downloadMenu"      },
            { text: "Payment Issue",     icon: "fa fa-credit-card",    action: "paymentMenu"       },
            { text: "Customization",     icon: "fa fa-tools",          action: "customizationMenu" },
            { text: "Account Problem",   icon: "fa fa-user-lock",      action: "accountMenu"       },
            { text: "Contact Support",   icon: "fa fa-envelope",       action: "contactSupport"    }
        ]);
    };

    /* ── Download ── */
    window.downloadMenu = async function () {
        await addMessage("Sure! Is this a <strong>Free</strong> or <strong>Premium</strong> template?");

        addButtons([
            { text: "Free Template",    icon: "fa fa-file",       action: "freeTemplate"    },
            { text: "Premium Template", icon: "fa fa-star",       action: "premiumTemplate" },
            { text: "← Back",          icon: "fa fa-arrow-left", action: "showMainMenu"    }
        ]);
    };

    window.freeTemplate = async function () {
        await addMessage("🎉 Free templates can be downloaded directly from our templates page — no account needed!");

        addButtons([
            { text: "Browse Templates", icon: "fa fa-external-link-alt", action: "goTemplates" },
            { text: "← Main Menu",      icon: "fa fa-home",              action: "showMainMenu" }
        ]);
    };

    window.goTemplates = function () {
    window.location.href = "/project";
};

    window.premiumTemplate = async function () {
        await addMessage("✨ Premium templates use a one-time payment. After payment you'll receive access to the private GitHub repository.");

        addButtons([
            { text: "How does it work?", icon: "fa fa-question-circle", action: "howPremiumWorks" },
            { text: "Payment failed?",   icon: "fa fa-times-circle",    action: "paymentFailed"   },
            { text: "← Back",           icon: "fa fa-arrow-left",      action: "downloadMenu"    }
        ]);
    };

    window.howPremiumWorks = async function () {
        await addMessage(
            "<strong>Here's how it works:</strong><br><br>" +
            "1️⃣ Select your template<br>" +
            "2️⃣ Complete payment via Razorpay / UPI<br>" +
            "3️⃣ Get redirected to the private GitHub repo<br>" +
            "4️⃣ Download the ZIP<br>" +
            "5️⃣ Start editing!"
        );

        addButtons([
            { text: "Go to Templates", icon: "fa fa-external-link-alt", action: "goTemplates"  },
            { text: "← Main Menu",    icon: "fa fa-home",              action: "showMainMenu" }
        ]);
    };

    window.paymentFailed = async function () {
        await addMessage("😟 Sorry about that! Please double-check:<br>• Card details & balance<br>• UPI app connection<br>• Try a different payment method<br><br>Still stuck? Contact support below.");

        addButtons([
            { text: "Contact Support", icon: "fa fa-envelope",   action: "contactSupport" },
            { text: "← Main Menu",    icon: "fa fa-home",       action: "showMainMenu"   }
        ]);
    };

    /* ── Payment ── */
    window.paymentMenu = async function () {
        await addMessage("I can help with payment issues. What's going on?");

        addButtons([
            { text: "No GitHub Access", icon: "fa fa-exclamation-triangle", action: "noGithubAccess" },
            { text: "Need Invoice",     icon: "fa fa-file-invoice",          action: "needInvoice"    },
            { text: "Refund Request",   icon: "fa fa-undo",                  action: "refundRequest"  },
            { text: "← Back",          icon: "fa fa-arrow-left",            action: "showMainMenu"   }
        ]);
    };

    window.noGithubAccess = async function () {
        await addMessage("This can happen if the email used for payment differs from your GitHub email. Please contact support with your transaction ID and we'll sort it out quickly.");

        addButtons([
            { text: "Contact Support", icon: "fa fa-envelope", action: "contactSupport" },
            { text: "← Main Menu",    icon: "fa fa-home",     action: "showMainMenu"   }
        ]);
    };

    window.needInvoice = async function () {
        await addMessage("📧 Your invoice is automatically sent to your registered email after payment. Check your <strong>Spam / Promotions</strong> folder too.<br><br>Still can't find it? Contact us!");

        addButtons([
            { text: "Contact Support", icon: "fa fa-envelope", action: "contactSupport" },
            { text: "← Main Menu",    icon: "fa fa-home",     action: "showMainMenu"   }
        ]);
    };

    window.refundRequest = async function () {
        await addMessage("We process refunds within <strong>5–7 business days</strong>. Please contact support with your order details and reason for refund.");

        addButtons([
            { text: "Contact Support", icon: "fa fa-envelope", action: "contactSupport" },
            { text: "← Main Menu",    icon: "fa fa-home",     action: "showMainMenu"   }
        ]);
    };

    /* ── Customization ── */
    window.customizationMenu = async function () {
        await addMessage("What kind of customization help do you need?");

        addButtons([
            { text: "Change Colors",   icon: "fa fa-palette",      action: "changeColors"   },
            { text: "Add a Section",   icon: "fa fa-plus-circle",   action: "addSection"     },
            { text: "Fix Layout",      icon: "fa fa-th-large",      action: "fixLayout"      },
            { text: "Something else",  icon: "fa fa-ellipsis-h",    action: "contactSupport" },
            { text: "← Back",         icon: "fa fa-arrow-left",    action: "showMainMenu"   }
        ]);
    };

    window.changeColors = async function () {
        await addMessage("All our templates use <strong>CSS variables</strong>. Open <code>style.css</code> and find the <code>:root</code> block — change the hex values there to restyle everything instantly.");

        addButtons([
            { text: "Still need help?", icon: "fa fa-question-circle", action: "contactSupport"    },
            { text: "← Back",          icon: "fa fa-arrow-left",      action: "customizationMenu" }
        ]);
    };

    window.addSection = async function () {
        await addMessage("Each section in our templates is a self-contained Bootstrap row. Copy an existing section block and paste it where you need it, then update the content. Need specific help? Contact us!");

        addButtons([
            { text: "Contact Support", icon: "fa fa-envelope",   action: "contactSupport"    },
            { text: "← Back",         icon: "fa fa-arrow-left", action: "customizationMenu" }
        ]);
    };

    window.fixLayout = async function () {
        await addMessage("Most layout issues come from missing Bootstrap grid classes. Make sure your columns use <code>col-md-*</code> inside a <code>row</code> div. Want us to take a look? Contact support!");

        addButtons([
            { text: "Contact Support", icon: "fa fa-envelope",   action: "contactSupport"    },
            { text: "← Back",         icon: "fa fa-arrow-left", action: "customizationMenu" }
        ]);
    };

    /* ── Account ── */
    window.accountMenu = async function () {
        await addMessage("What account issue are you facing?");

        addButtons([
            { text: "Forgot Password", icon: "fa fa-key",        action: "forgotPassword" },
            { text: "Cannot Login",    icon: "fa fa-user-times", action: "cannotLogin"    },
            { text: "Delete Account",  icon: "fa fa-trash",      action: "deleteAccount"  },
            { text: "← Back",         icon: "fa fa-arrow-left", action: "showMainMenu"   }
        ]);
    };

    window.forgotPassword = async function () {
        await addMessage("Click <strong>'Forgot Password'</strong> on the login page and enter your registered email. A reset link will arrive within a few minutes. Check Spam too!");

        addButtons([
            { text: "Still can't access?", icon: "fa fa-envelope",   action: "contactSupport" },
            { text: "← Main Menu",        icon: "fa fa-home",       action: "showMainMenu"   }
        ]);
    };

    window.cannotLogin = async function () {
        await addMessage("Make sure you're using the <strong>exact email</strong> used during registration and that Caps Lock is off. Try resetting your password if the issue persists.");

        addButtons([
            { text: "Reset Password",  icon: "fa fa-key",     action: "forgotPassword" },
            { text: "Contact Support", icon: "fa fa-envelope", action: "contactSupport" }
        ]);
    };

    window.deleteAccount = async function () {
        await addMessage("To request account deletion, please email us with your registered email address. We'll process it within 48 hours.");

        addButtons([
            { text: "Contact Support", icon: "fa fa-envelope", action: "contactSupport" },
            { text: "← Main Menu",    icon: "fa fa-home",     action: "showMainMenu"   }
        ]);
    };

    /* ── Contact ── */
    window.contactSupport = async function () {
        await addMessage(
            "📬 <strong>Reach us anytime:</strong><br><br>" +
            "<i class='fa fa-envelope' style='color:#116466'></i> &nbsp;<strong>thewebstudio.io@gmail.com</strong><br><br>" +
            "We typically respond within <strong>24–48 hours</strong>.<br><br>" +
            "Please include your <em>order ID / transaction ID</em> for faster resolution. 🙏"
        );

        addButtons([
            { text: "← Main Menu", icon: "fa fa-home", action: "showMainMenu" }
        ]);
    };

    /* ════════════════════════════════════
       SCROLL-BASED SHOW / HIDE BUTTON
    ════════════════════════════════════ */
    chatBtn.style.opacity = "0";
    chatBtn.style.pointerEvents = "none";
    chatBtn.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    function updateBtnVisibility() {
        if (window.scrollY > 300) {
            chatBtn.style.opacity = "1";
            chatBtn.style.pointerEvents = "auto";
        } else {
            chatBtn.style.opacity = "0";
            chatBtn.style.pointerEvents = "none";
            if (isOpen) closeChat();
        }
    }

    window.addEventListener("scroll", updateBtnVisibility, { passive: true });
    updateBtnVisibility();
});