import { Breadcrumb, Layout, theme } from 'antd'
import { useBreadcrumb } from '../hooks/useBreadcrumb';

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()
    const breadcrumbItems = useBreadcrumb()

    const breadcrumbRenderItems = breadcrumbItems.map((item, index) => ({
        title: item.href ? <a href={item.href}>{item.title}</a> : item.title,
        key: index.toString()
    }))

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                
            </Header>
        
            <Content style={{ 
                padding: '0 48px', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Breadcrumb
                    style={{ margin: '16px 0', flexShrink: 0 }}
                    items={breadcrumbRenderItems}
                />
                <div
                    style={{
                        background: colorBgContainer,
                        flex: 1,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        marginBottom: 24,
                        height: '100%'
                        
                    }}
                >
                    {children}
                </div>
            </Content>
      
            <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
                My App ©{new Date().getFullYear()} Created with Ant Design
            </Footer>
        </Layout>
    )
}

export default AppLayout