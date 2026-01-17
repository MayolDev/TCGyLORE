import { defaultSchema } from 'rehype-sanitize';

export const rehypeSanitizeOptions = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        span: [
            ...(defaultSchema.attributes?.span || []),
            'className',
            'data-tooltip',
            'dataTooltip',
        ],
        sup: [
            ...(defaultSchema.attributes?.sup || []),
            'className',
        ],
    },
};
