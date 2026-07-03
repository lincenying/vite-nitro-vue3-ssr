import { breakpoints, webConfig } from '@lincy/unocss-base-config'

const baseConfig = webConfig('wind3', { preflight: false })

export default {
    ...baseConfig,
    safelist: [
        ...(baseConfig.safelist || []),
        ...Array.from({ length: 10 }, (_, i) => `i-fad-digital${i}`),
    ],
    theme: {
        breakpoints: {
            ...breakpoints,
            m1360: '1360.1px',
        },
    },
}
