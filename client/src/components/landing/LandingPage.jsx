import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    BarChart3,
    FileSpreadsheet,
    PieChart,
    UserCheck,
    Globe,
    Download,
    LineChart,
    Box,
    ArrowRight,
} from 'lucide-react'

const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-xl bg-primary">
                                <span className="text-primary-foreground font-bold text-lg">DV</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">DataViz</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate('/login')}>
                                Log in
                            </Button>
                            <Button onClick={() => navigate('/signup')}>Sign up</Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-24 md:py-36 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Transform Your Excel Data into
                        <span className="text-primary block mt-2">Beautiful Visualizations</span>
                    </h1>
                    <p className="mt-8 text-xl text-muted-foreground max-w-3xl mx-auto">
                        Upload your spreadsheets and instantly create interactive 2D and 3D charts with DataViz's
                        powerful visualization platform.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => navigate('/signup')}>
                            Get Started Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                            Log in to Dashboard
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-muted/50 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">Powerful Features for Data Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FileSpreadsheet className="h-10 w-10 text-primary" />}
                            title="Excel Import"
                            description="Upload Excel files (.xlsx, .xls) and instantly process your data for visualization."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-10 w-10 text-primary" />}
                            title="Interactive 2D Charts"
                            description="Create line, bar, scatter, pie, and area charts with full customization options."
                        />
                        <FeatureCard
                            icon={<Box className="h-10 w-10 text-primary" />}
                            title="3D Visualizations"
                            description="Generate immersive 3D bubble charts to discover deeper data patterns."
                        />
                        <FeatureCard
                            icon={<LineChart className="h-10 w-10 text-primary" />}
                            title="Analytics Dashboard"
                            description="View all your visualizations in one place with a customizable dashboard."
                        />
                        <FeatureCard
                            icon={<Download className="h-10 w-10 text-primary" />}
                            title="Export Capabilities"
                            description="Download your charts as images or export processed data for sharing."
                        />
                        <FeatureCard
                            icon={<UserCheck className="h-10 w-10 text-primary" />}
                            title="User Management"
                            description="Admin tools for user roles, permissions, and platform statistics."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 md:py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">How DataViz Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mb-6">
                                <FileSpreadsheet className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">1. Upload Your Data</h3>
                            <p className="text-muted-foreground">
                                Simply drag and drop your Excel files or use the file browser to upload your data.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mb-6">
                                <PieChart className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">2. Configure Visualization</h3>
                            <p className="text-muted-foreground">
                                Select chart type, axes, and customize appearance with our intuitive interface.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mb-6">
                                <Globe className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">3. Share & Export</h3>
                            <p className="text-muted-foreground">
                                Download your visualizations, save your analysis, or share insights with your team.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-primary px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-primary-foreground mb-6">Ready to Visualize Your Data?</h2>
                    <p className="text-xl text-primary-foreground/90 mb-10">
                        Join thousands of data analysts who have transformed their Excel data into meaningful insights.
                    </p>
                    <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-muted px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-6 md:mb-0">
                            <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
                                <span className="text-primary-foreground font-bold text-sm">DV</span>
                            </div>
                            <span className="text-lg font-semibold">DataViz</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} DataViz. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-background p-6 rounded-lg border hover:shadow-md transition-all">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}

export default LandingPage
