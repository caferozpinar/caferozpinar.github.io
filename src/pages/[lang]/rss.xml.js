import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SUPPORTED_LANGS, ui } from '../../lib/i18n';

export function getStaticPaths() {
	return SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
	const lang = context.params.lang;
	const copy = ui[lang];

	const posts = (
		await getCollection('blog', ({ data }) => data.locale === lang && !data.draft)
	).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

	return rss({
		title: copy.siteTitle,
		description: copy.blog.description,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/${lang}/blog/${post.id.replace(`${lang}/`, '')}/`,
		})),
	});
}
