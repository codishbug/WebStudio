document.addEventListener("DOMContentLoaded", async function () {

    const container = document.getElementById("blogContainer");

    // ✅ STOP if not blog listing page
    if (!container) return;

    if (!window.supabase) {
        console.error("Supabase not loaded");
        return;
    }

    // ✅ CREATE CLIENT ONLY HERE (LOCAL)
    const supabaseClient = window.supabase.createClient(
        "https://yuuvbsctwcrzubblkjlq.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dXZic2N0d2NyenViYmxramxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODIzNjYsImV4cCI6MjA4NjM1ODM2Nn0.2js6OF_T1oBECrSHJVgSF7_H5KYTpWqdQAGjgs5dVUs"
    );

    async function loadBlogs() {

        const { data: blogs, error } = await supabaseClient
            .from("blogs")
            .select("*")
            .eq("status", "published")
            .order("id", { ascending: false });

        if (error) {
            container.innerHTML = "<h5>Error loading blogs</h5>";
            return;
        }

        if (!blogs || blogs.length === 0) {
            container.innerHTML = "<h5>No blogs found</h5>";
            return;
        }

        container.innerHTML = "";

        let delay = 0.3;

        blogs.forEach(blog => {

            container.innerHTML += `
            <div class="col-lg-6 col-xl-4 d-flex wow fadeIn" data-wow-delay="${delay}s">

                <div class="blog-item position-relative bg-light rounded d-flex flex-column w-100">

                    <img src="${blog.image_url}" 
                         class="img-fluid w-100 rounded-top"
                         style="height: 250px; object-fit: cover;">

                    <span class="position-absolute px-4 py-3 bg-primary text-white rounded"
                          style="top: -28px; right: 20px;">
                        ${blog.category}
                    </span>

                    <div class="blog-content text-center px-4 py-4 flex-grow-1">

                        <span class="text-primary d-block mb-2 fw-semibold">
                            ${blog.title}
                        </span>

                        <p class="mb-4">
                            ${blog.excerpt}
                        </p>

                        <a href="/blog-details?id=${blog.id}"
                           class="btn btn-secondary px-4 py-2 rounded-pill">
                            Read More
                        </a>

                    </div>

                    <div class="blog-coment text-center px-4 py-2 border bg-primary rounded-bottom mt-auto text-white">
                        <i class="far fa-clock text-secondary me-2"></i> 
                        ${blog.read_time} min read
                    </div>

                </div>
            </div>
            `;

            delay += 0.2;
        });
    }

    loadBlogs();
});