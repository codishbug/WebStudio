async function loadBlogs() {

    const container = document.getElementById("blogContainer");

    // ✅ STOP if element doesn't exist
    if (!container) return;

    const { data: blogs, error } = await supabaseClient
        .rpc("get_latest_blogs");

    if (error) {
        console.log(error);
        return;
    }

    container.innerHTML = "";

    let delay = 0.3;

    blogs.forEach(blog => {
        container.innerHTML += `
        <div class="col-lg-6 col-xl-4 d-flex wow fadeIn" data-wow-delay=".${delay}s">
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

                    <p class="mb-4">${blog.excerpt}</p>

                    <div class="text-center">
                        <a href="/blog-details?id=${blog.id}"
                        class="btn btn-secondary px-4 py-2 rounded-pill">
                            Read More
                        </a>
                    </div>

                </div>

                <div class="blog-coment d-flex justify-content-center px-4 py-2 border bg-primary rounded-bottom mt-auto">
                    <span class="text-white">
                        <i class="far fa-clock text-secondary me-2"></i> 
                        ${blog.read_time} min read
                    </span>
                </div>

            </div>
        </div>
        `;

        delay += 0.2;
    });
}

loadBlogs();