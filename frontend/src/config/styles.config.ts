import { createStyles } from 'antd-style'

export const useTableStyles = createStyles(({ css }) => {
    return {
        customTable: css`
            .ant-table {
                .ant-table-container {
                    .ant-table-body,
                    .ant-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;

                        &::-webkit-scrollbar {
                            width: 8px;
                            height: 8px;
                        }
                
                        &::-webkit-scrollbar-track {
                            background: transparent;
                        }
                
                        &::-webkit-scrollbar-thumb {
                            background: #eaeaea;
                            border-radius: 4px;
                        }
                
                        &::-webkit-scrollbar-thumb:hover {
                            background: #d5d5d5;
                        }
                    }
                }
            }
        `
    }
})

export const TABLE_SCROLL_CONFIG = {
    x: 1800,
    y: 380
} as const

export const PAGINATION_CONFIG = {
    showTotal: (total: number, range: [number, number]) => (
        `${range[0]}-${range[1]} из ${total} пользователей`
    )
} as const