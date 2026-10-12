export const areas = ['Patterns', 'Shapes', 'Numbers', 'Words'] as const;
export const concepts = ['Rotation', 'Symmetry', 'Sequence', 'Classification', 'Analogy'];
export const faqs = [
 ['Is this only for test preparation?', 'No. Assessment-style practice is a starting point. The experience also invites children to explore patterns, spatial relationships, numbers, and verbal connections.'],
 ['Which assessments does it cover?', 'Our planned library includes independently created CogAT, OLSAT, and NNAT-style practice. Heir of Wisdom is not affiliated with or endorsed by their publishers. The current preview demonstrates a small set of original reasoning activities.'],
 ['What ages is it designed for?', 'The intended audience is approximately 5–13. Supported ages, reading levels, and the full content library are being validated before launch. A parent can explore the sample together with their child.'],
 ['How do you show progress?', 'We record answers, hints, explanations, manipulation, and transfer interactions. Reports describe those observations without IQ scores, peer comparisons, or unsupported mastery claims.'],
 ['How much does it cost?', 'One monthly USD subscription is planned. The final price has not been approved; $XX/month is a placeholder. No live payments are accepted in this preview.'],
 ['Who controls my child’s information?', 'Parents create and manage private child profiles. We ask for a display name and age, rather than a child’s email or full birth date. The privacy policy and guardian consent process require review before launch.'],
 ['Can I cancel my subscription?', 'The intended policy is cancellation before the next renewal, with access through the paid period. Final terms will be confirmed before Dodo Payments goes live.'],
];
export function pageHead(title: string, description: string, path: string, privatePage = false) {
 return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:url', content: path }, { name: 'twitter:card', content: 'summary_large_image' }, ...(privatePage ? [{ name: 'robots', content: 'noindex, nofollow' }] : [])], links: [{ rel: 'canonical', href: path }] };
}
