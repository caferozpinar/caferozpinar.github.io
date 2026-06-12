export const SUPPORTED_LANGS = ['en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const isLang = (value: string | undefined): value is Lang =>
	typeof value === 'string' && SUPPORTED_LANGS.includes(value as Lang);

export const ui = {
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
