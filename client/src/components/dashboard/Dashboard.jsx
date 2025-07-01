import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDashboardData } from '../../redux/slices/dashboardSlice'
import { setSelectedData } from '../../redux/slices/chartSlice'
import DashboardHeader from './DashboardHeader'
import ProfileCard from './ProfileCard'
import UploadSection from './UploadSection'
import UploadHistory from './UploadHistory'
import ChartDashboard from '../charts/ChartDashboard'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchUserUploads } from '@/services/api'

// Number of rows to show in the data preview table
const DATA_PREVIEW_ROW_LIMIT = 20

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { profile, isLoading } = useSelector((state) => state.dashboard)
    const [viewData, setViewData] = useState(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [history, setHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(true)
    const [historyError, setHistoryError] = useState('')

    const refreshHistory = useCallback(async () => {
        setHistoryLoading(true)
        setHistoryError('')
        try {
            const res = await fetchUserUploads()
            setHistory(
                res.data.uploads.map((item) => ({
                    id: item._id,
                    fileName: item.fileName || 'Excel Upload',
                    uploadDate: item.uploadDate,
                    rowCount: item.data?.length || 0,
                    data: item.data || [],
                }))
            )
        } catch {
            setHistoryError('Failed to load upload history.')
        } finally {
            setHistoryLoading(false)
        }
    }, [])

    useEffect(() => {
        dispatch(getDashboardData())
        refreshHistory()
    }, [dispatch, refreshHistory])

    const handleLogout = () => {
        navigate('/login')
    }

    const handleView = (item) => {
        setViewData(item)
        setViewOpen(true)
    }

    const handleUploadSuccess = () => {
        refreshHistory()
    }

    const handleCreateChart = (data) => {
        dispatch(setSelectedData(data))
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-6" />
                        <h3 className="text-lg font-semibold text-center mb-2">
                            Loading Dashboard
                        </h3>
                        <p className="text-muted-foreground text-center">
                            Please wait while we prepare your workspace...
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background px-4">
            <DashboardHeader user={user || profile} onLogout={handleLogout} />
            <div className="max-w-7xl mx-auto pt-8">
                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="charts">
                            Charts & Analytics
                        </TabsTrigger>
                        <TabsTrigger value="uploads">Uploads</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <ProfileCard
                                    user={{
                                        ...(user || profile),
                                        uploadsCount: history.length,
                                    }}
                                />
                            </div>
                            <div className="lg:col-span-2 space-y-8">
                                <UploadSection
                                    onUploadSuccess={handleUploadSuccess}
                                />
                                <UploadHistory
                                    history={history}
                                    loading={historyLoading}
                                    error={historyError}
                                    onView={handleView}
                                    onDelete={refreshHistory}
                                    onCreateChart={handleCreateChart}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="charts" className="space-y-8">
                        <ChartDashboard />
                    </TabsContent>

                    <TabsContent value="uploads" className="space-y-8">
                        <div className="space-y-8">
                            <UploadSection
                                onUploadSuccess={handleUploadSuccess}
                            />
                            <UploadHistory
                                history={history}
                                loading={historyLoading}
                                error={historyError}
                                onView={handleView}
                                onDelete={refreshHistory}
                                onCreateChart={handleCreateChart}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {viewOpen && viewData && (
                    <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Uploaded Data</DialogTitle>
                            </DialogHeader>
                            {Array.isArray(viewData?.data) &&
                            viewData.data.length > 0 ? (
                                <div className="overflow-x-auto max-h-96">
                                    {(() => {
                                        const columns = Object.keys(
                                            viewData.data[0]
                                        )
                                        return (
                                            <table className="min-w-full text-xs border bg-background rounded">
                                                <thead>
                                                    <tr>
                                                        {columns.map((col) => (
                                                            <th
                                                                key={col}
                                                                className="px-2 py-1 border-b bg-muted text-left font-semibold"
                                                            >
                                                                {col}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {viewData.data
                                                        .slice(
                                                            0,
                                                            DATA_PREVIEW_ROW_LIMIT
                                                        )
                                                        .map((row, i) => (
                                                            <tr
                                                                key={i}
                                                                className="even:bg-muted/50"
                                                            >
                                                                {columns.map(
                                                                    (col) => (
                                                                        <td
                                                                            key={
                                                                                col
                                                                            }
                                                                            className="px-2 py-1 border-b"
                                                                        >
                                                                            {
                                                                                row[
                                                                                    col
                                                                                ]
                                                                            }
                                                                        </td>
                                                                    )
                                                                )}
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        )
                                    })()}
                                    {viewData.data.length >
                                        DATA_PREVIEW_ROW_LIMIT && (
                                        <div className="text-xs text-muted-foreground mt-2">
                                            Showing first{' '}
                                            {DATA_PREVIEW_ROW_LIMIT} of{' '}
                                            {viewData.data.length} rows
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-sm">
                                    No data to display.
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    )
}

export default Dashboard
