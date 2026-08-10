import { defaultSchema } from 'rehype-sanitize';

export const rehypeSanitizeSchema = {
    ...defaultSchema,
    tagNames: [
        ...(defaultSchema.tagNames || []),
        'sup',
        'span',
        'div',
    ],
    attributes: {
        ...defaultSchema.attributes,
        '*': ['className'], // Allow class names globally for styling
        span: [...(defaultSchema.attributes?.span || []), 'data-tooltip'],
        // Allow style if strictly necessary, but better to avoid for security.
        // We'll stick to className for now as citations use classes.
    },
};
