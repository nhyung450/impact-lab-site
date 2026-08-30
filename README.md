# IMPACT Lab website

A responsive, build-free static website for IMPACT Lab at KAIST. The site is designed for GitHub Pages and uses only HTML, CSS, and a small amount of vanilla JavaScript.

## Preview locally

From this directory, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create an empty GitHub repository.
2. Upload everything in this directory to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.

GitHub will show the public URL after deployment. A custom domain such as `www.sohyoung-in.com` can be connected later in the same Pages settings screen.

## Updating the site

- Home-page news: edit the `.news-item` blocks in `index.html`.
- People: edit cards in `people.html`; place new portraits in `assets/images/`.
- Publications: add an `.publication-item` in `publications.html` and set `data-pub-type` to `journal`, `book`, `conference`, or `report`.
- Courses: edit the `.course-card` blocks in `teaching.html`.
- Shared navigation/footer: edit `assets/js/site.js`.
- Colors/layout: edit the variables at the top of `assets/css/style.css`.

The contact form deliberately uses `mailto:` so no visitor information is stored. If a server-side form is needed later, connect a service such as Formspree or a small API endpoint.
