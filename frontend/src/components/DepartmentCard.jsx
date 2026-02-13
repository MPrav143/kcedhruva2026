import { BookOpen, Code, Trophy } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const DepartmentCard = ({ dept, stats, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group h-[22rem] rounded-2xl border-black overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col border border-gray-100"
        >
            {/* Top Section - Image (1/3) */}
            <div className="h-1/3 w-full relative overflow-hidden">
                <img
                    src={getImageUrl(dept.image)}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Bottom Section - Content (2/3) */}
            {/* Added 'group' class here to control children on hover */}
            <div className="h-2/3 p-6 flex flex-col items-center group hover:bg-blue-400 transition-all duration-300 text-center rounded-xl bg-white/5 backdrop-blur-xl border-t border-white/10 justify-between cursor-pointer">

                <div className="w-full">
                    {/* Changed to text-white and added group-hover:text-black */}
                    <h3 className="text-xl font-bold text-white roboto-mono-bold leading-tight mb-4 transition-colors duration-300">
                        {dept.name}
                    </h3>

                    {/* Stats Section */}
                    <div className="space-y-3 mt-2 text-white/70 playwrite-nz-basic-light">

                        {/* Row 1 */}
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
                                <BookOpen size={16} />
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <span className="text-sm font-medium text-white/80 transition-colors duration-300">Workshops</span>
                                <span className="text-sm font-bold text-white transition-colors duration-300">{stats.workshops || 0}</span>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500">
                                <Code size={16} />
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <span className="text-sm font-medium text-white/80 transition-colors duration-300">Technical Events</span>
                                <span className="text-sm font-bold text-white transition-colors duration-300">{stats.technical || 0}</span>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500">
                                <Trophy size={16} />
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <span className="text-sm font-medium text-white/80 transition-colors duration-300">Non-Technical Events</span>
                                <span className="text-sm font-bold text-white transition-colors duration-300">{stats.nonTechnical || 0}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentCard;
