export const SUPPORTED_LANGS = ['tr', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const isLang = (value: string | undefined): value is Lang =>
	typeof value === 'string' && SUPPORTED_LANGS.includes(value as Lang);

export const ui = {
	tr: {
		siteTitle: 'Cafer | Teknik Notlar',
		nav: {
			home: 'Ana Sayfa',
			projects: 'Projeler',
			blog: 'Blog',
			about: 'Hakkımda',
			contact: 'İletişim',
		},
		toggleThemeAria: 'Tema değiştir',
		footer: 'İçerik odaklı kişisel teknik web sitesi.',
		home: {
			heading: 'Teknik içerik, gerçek süreç, sade sunum.',
			intro:
				'Bilgisayar mühendisliği öğrencisi. Yazılım geliştirme, Linux, tersine mühendislik, gömülü sistemler ve teknik araştırmalar üzerine çalışıyorum.',
			cards: {
				projects: 'Projeler',
				blog: 'Teknik Blog',
				lab: 'Araştırmalar / Deneyler',
			},
			recentPosts: 'Son Yazılar',
			recentProjects: 'Son Projeler',
			externalLinks: 'Dış Linkler',
		},
		about: {
			title: 'Hakkımda',
			description:
				'Kısa ve teknik odaklı bir profil: eğitim, ilgi alanları, teknoloji tercihlerim ve mühendislik yaklaşımım.',
		},
		projects: {
			title: 'Projeler',
			description: 'Gerçek teknik süreçleri, mimari kararları ve sonuçları anlatan proje kayıtları.',
		},
		blog: {
			title: 'Blog',
			description: 'Teknik rehberler, araştırmalar, deneyler ve lab notları.',
		},
		contact: {
			title: 'İletişim ve Linkler',
			description: 'GitHub, LinkedIn ve e-posta üzerinden iletişim kurabilirsiniz.',
		},
	},
	en: {
		siteTitle: 'Cafer | Technical Notes',
		nav: {
			home: 'Home',
			projects: 'Projects',
			blog: 'Blog',
			about: 'About',
			contact: 'Contact',
		},
		toggleThemeAria: 'Toggle theme',
		footer: 'Content-first personal technical website.',
		home: {
			heading: 'Technical writing, real process, simple presentation.',
			intro:
				'Computer engineering student. I work on software development, Linux, reverse engineering, embedded systems, and technical research.',
			cards: {
				projects: 'Projects',
				blog: 'Technical Blog',
				lab: 'Research / Experiments',
			},
			recentPosts: 'Recent Posts',
			recentProjects: 'Recent Projects',
			externalLinks: 'External Links',
		},
		about: {
			title: 'About',
			description:
				'A short technical profile: education, interests, technologies, and engineering mindset.',
		},
		projects: {
			title: 'Projects',
			description: 'Project logs focused on real technical process, architecture, and outcomes.',
		},
		blog: {
			title: 'Blog',
			description: 'Technical guides, research notes, experiments, and lab notes.',
		},
		contact: {
			title: 'Contact and Links',
			description: 'Reach me through GitHub, LinkedIn, and email.',
		},
	},
};

export function switchLocalePath(pathname: string, lang: Lang): string {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) return `/${lang}/`;
	if (isLang(segments[0])) {
		segments[0] = lang;
		return `/${segments.join('/')}${pathname.endsWith('/') ? '/' : ''}`;
	}
	return `/${lang}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
