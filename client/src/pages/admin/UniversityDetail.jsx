import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Building2,
    Users,
    BookOpen,
    ArrowLeft,
    Mail,
    Calendar,
    CheckCircle,
    XCircle,
    Download
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import ModernButton from '../../components/ui/ModernButton';
import DashboardHeading from '../../components/ui/DashboardHeading';
import { useToast } from '../../context/ToastContext';

const UniversityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [university, setUniversity] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`/api/admin/universities/${id}`, config);
                setUniversity(data.university);
                setStudents(data.students);
            } catch (error) {
                console.error('Error fetching university details:', error);
                showToast('Failed to load university details', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!university) {
        return (
            <div className="text-center py-20">
                <p className="text-white/60 mb-4">University not found</p>
                <ModernButton onClick={() => navigate('/admin/university')}>
                    Back to List
                </ModernButton>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/university')}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-left">
                        <DashboardHeading title={university.name} />
                        <p className="text-white/40 text-sm font-inter">Institution Intelligence Hub</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <ModernButton variant="secondary" onClick={() => window.print()}>
                        Generate Audit Report
                    </ModernButton>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Info Card */}
                <GlassCard className="lg:col-span-1 space-y-6">
                    <div className="flex flex-col items-center py-6 border-b border-white/10">
                        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-2xl shadow-primary/20">
                            <Building2 size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center">{university.name}</h3>
                        <p className="text-primary text-xs font-black uppercase tracking-widest mt-1">Primary Partner</p>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Email</span>
                            <span className="text-white text-sm font-semibold">{university.email}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Discount Rate</span>
                            <span className="text-emerald-400 text-sm font-bold">{university.discountRate || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Status</span>
                            <div className="flex items-center space-x-1.5">
                                <span className={`w-2 h-2 rounded-full ${university.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span className={`text-xs font-bold ${university.isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {university.isVerified ? 'VERIFIED' : 'PENDING'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-center">
                                <p className="text-primary text-xl font-bold">{students.length}</p>
                                <p className="text-white/30 text-[10px] font-black uppercase">Students</p>
                            </div>
                            <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-center">
                                <p className="text-indigo-400 text-xl font-bold">{university.assignedCourses?.length || 0}</p>
                                <p className="text-white/30 text-[10px] font-black uppercase">Courses</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Right Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Courses List */}
                    <GlassCard className="!p-0 border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white font-inter flex items-center">
                                <BookOpen size={18} className="mr-2 text-primary" /> Assigned Curriculums
                            </h3>
                            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase">
                                {university.assignedCourses?.length || 0} Total
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            {university.assignedCourses?.length > 0 ? (
                                university.assignedCourses.map(course => (
                                    <div
                                        key={course._id}
                                        onClick={() => navigate(`/admin/courses/edit/${course._id}`)}
                                        className="p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-primary/50 transition-all flex items-center space-x-4 cursor-pointer hover:bg-white/10"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <BookOpen size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold truncate text-sm">{course.title}</p>
                                            <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{course.category}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                                    <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">No Courses Linked</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Students List */}
                    <GlassCard className="!p-0 border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white font-inter flex items-center">
                                <Users size={18} className="mr-2 text-emerald-400" /> Registered Learners
                            </h3>
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold uppercase">
                                {students.length} Active
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-inter">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Learner</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Enrolled Course</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Verification</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Joining Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {students.map(student => (
                                        <tr
                                            key={student._id}
                                            className="hover:bg-white/5 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/admin/students`)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs uppercase">
                                                        {student.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold text-sm">{student.name}</p>
                                                        <p className="text-white/40 text-[10px]">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-white text-xs font-semibold">{student.course || 'Enrolled'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.isVerified ? (
                                                    <span className="flex items-center text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                                        <CheckCircle size={12} className="mr-1" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                                                        <XCircle size={12} className="mr-1" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-white/60 text-xs font-medium">
                                                {new Date(student.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center text-white/20 text-xs font-black uppercase tracking-[0.3em]">
                                                No Students Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default UniversityDetail;
