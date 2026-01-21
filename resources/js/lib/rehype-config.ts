import { defaultSchema } from 'rehype-sanitize';

export const manualSanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        span: ['className', 'data-tooltip'],
        sup: ['className'],
    },
    tagNames: [...(defaultSchema.tagNames || []), 'span', 'sup'],
};
