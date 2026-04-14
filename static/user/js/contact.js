


// Make function global (VERY IMPORTANT)
window.sendMessage = async function () {
    try {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill required fields");
            return;
        }

        const { error } = await supabaseClient
            .from("contact_messages")
            .insert([{ name, email, subject, message }]);

        if (error) {
            console.error(error);
            alert("Error sending message");
        } else {
            alert("Message sent successfully!");

            // Clear fields
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("message").value = "";
        }

    } catch (err) {
        console.error(err);
        alert("Something broke. Check console.");
    }
};