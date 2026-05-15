# Personal Website (Astro + Markdown)

TR/EN dil destekli, içerik odaklı kişisel teknik web sitesi.

## Geliştirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## İçerik Yapısı

- Blog: `src/content/blog/{tr,en}/`
- Projeler: `src/content/projects/{tr,en}/`

Blog zorunlu frontmatter alanları:

- `locale` (`tr`/`en`)
- `title`
- `description`
- `pubDate`
- `tags`
- `metaTitle`
- `metaDescription`
- `ogImage` (opsiyonel)
- `githubUrl` (opsiyonel)
- `draft` (opsiyonel)

Proje zorunlu frontmatter alanları:

- `locale` (`tr`/`en`)
- `title`
- `description`
- `pubDate`
- `technologies`
- `status` (`active`/`completed`/`paused`)
- `updatedAt` (opsiyonel)
- `githubUrl` (opsiyonel)
- `demoUrl` (opsiyonel)
- `draft` (opsiyonel)

## Route Yapısı

- Ana sayfa: `/tr/`, `/en/`
- Blog: `/tr/blog/...`, `/en/blog/...`
- Projeler: `/tr/projects/...`, `/en/projects/...`
- Hakkımda: `/tr/about/`, `/en/about/`
- İletişim: `/tr/contact/`, `/en/contact/`

## GitHub Pages Dağıtımı

Workflow dosyası: `.github/workflows/deploy.yml`

Repository Variables:

- `SITE_URL`: Örn. `https://kullaniciadi.github.io`
- `BASE_PATH`: User pages için `/`, project pages için `/<repo-adi>/`

Bu değişkenler build aşamasında `astro.config.mjs` içindeki `site` ve `base` değerlerine uygulanır.
