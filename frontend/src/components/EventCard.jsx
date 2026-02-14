import { Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const EventCard = ({ event, onEdit, onDelete, onView }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 group">
            <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                    src={getImageUrl(event.image) || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                    {event.category}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span> <Calendar /> {new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    {(event.fromTime && event.toTime) ? (
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock inline-block mr-1"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                {event.fromTime} - {event.toTime}
                            </span>
                        </div>
                    ) : (event.timings ? (
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock inline-block mr-1"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                {event.timings}
                            </span>
                        </div>
                    ) : null)}
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span> <MapPin /> {event.venue}</span>
                    </div>
                </div>

                {onEdit && onDelete ? (
                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={() => onEdit(event)}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-colors border border-white/10 text-sm font-medium"
                        >
                            <Edit size={16} /> Edit
                        </button>
                        <button
                            onClick={() => onDelete(event._id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors border border-red-500/20 text-sm font-medium"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onView && onView(event)}
                        className="w-full mt-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20"
                    >
                        Register Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventCard;
