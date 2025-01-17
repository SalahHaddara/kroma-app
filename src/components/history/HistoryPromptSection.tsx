import React, {useState, useEffect} from 'react';
import {format} from 'date-fns';
import {Card} from '@/components/ui/card';
import {getHistoryItems, HistoryItem, PaginationInfo} from '@/services/historyService';
import {Button} from '@/components/ui/button';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface HistoryPromptSectionProps {
    isDark: boolean;
}

const HistoryPromptSection: React.FC<HistoryPromptSectionProps> = ({isDark}) => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 6,
        total: 0,
        pages: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchHistory = async (page: number) => {
        try {
            setLoading(true);
            const data = await getHistoryItems(page);
            setHistoryItems(data.history);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(1);
    }, []);

    if (historyItems.length === 0 && !loading) {
        return (
            <div className={`text-center p-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No prompt history available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"/>
                    </div>
                ) : (
                    historyItems.map((item) => (
                        <Card
                            key={item._id}
                            className={`overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                            }`}
                        >
                            <div className="aspect-video w-full bg-slate-100 flex items-center justify-center">
                                {item.designImage ? (
                                    <img
                                        src={`data:image/png;base64,${item.designImage}`}
                                        alt="Generated Design"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center ${
                                                isDark ? 'text-slate-500' : 'text-slate-400'
                                            }">Image not available</div>
                      `;
                                        }}
                                    />
                                ) : (
                                    <div className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        No image available
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {format(new Date(item.createdAt), 'MMMM d, yyyy • h:mm a')}
                                </p>
                                <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {item.prompt}
                                </p>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => !loading && fetchHistory(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                    className={`${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'border-slate-200'}`}
                >
                    <ChevronLeft className="w-4 h-4"/>
                </Button>

                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Page {pagination.page} of {pagination.pages}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => !loading && fetchHistory(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages || loading}
                    className={`${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'border-slate-200'}`}
                >
                    <ChevronRight className="w-4 h-4"/>
                </Button>
            </div>
        </div>
    );
};

export default HistoryPromptSection;