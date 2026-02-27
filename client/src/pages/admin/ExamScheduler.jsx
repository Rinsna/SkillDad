import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Calendar, Clock, Trophy, Trash2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import ModernButton from '../../components/ui/ModernButton';
import DashboardHeading from '../../components/ui/DashboardHeading';
import { useToast } from '../../context/ToastContext';

const ExamScheduler = () => {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        course: '',
        targetUniversity: '',
        scheduledDate: '',
        duration: 60,
        totalMarks: 100,
        passingMarks: 40
    });

    const fetchExams = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/exams', config);
            setExams(data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/courses/admin', config);
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchUniversities = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/admin/universities', config);
            setUniversities(data);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    };

    useEffect(() => {
        fetchExams();
        fetchCourses();
        fetchUniversities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        try {
            await axios.post('/api/exams', formData, config);
            setShowModal(false);
            setFormData({ title: '', course: '', targetUniversity: '', scheduledDate: '', duration: 60, totalMarks: 100, passingMarks: 40 });
            fetchExams();
            showToast('Exam scheduled successfully!', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Error scheduling exam', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scheduled exam?')) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            try {
                await axios.delete(`/api/exams/${id}`, config);
                fetchExams();
                showToast('Exam deleted successfully', 'success');
            } catch (error) {
                showToast(error.response?.data?.message || 'Error deleting exam', 'error');
            }
        }
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <DashboardHeading title="Exam Scheduler" />
                    </div>
                    <ModernButton onClick={() => setShowModal(true)} className="!px-4 !py-2 text-sm">
                        <Plus size={16} className="mr-1.5" /> Schedule Exam
                    </ModernButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-white/50 text-xs font-semibold uppercase">Total Exams</p>
                                <p className="text-lg font-semibold text-white font-inter">{exams.length}</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-500/10 text-white rounded-2xl">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-white/50 text-xs font-semibold uppercase">Upcoming</p>
                                <p className="text-lg font-semibold text-white font-inter">
                                    {exams.filter(e => new Date(e.scheduledDate) > new Date()).length}
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-amber-500/10 text-white rounded-2xl">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-white/50 text-xs font-semibold uppercase">Completed</p>
                                <p className="text-lg font-semibold text-white font-inter">
                                    {exams.filter(e => new Date(e.scheduledDate) < new Date()).length}
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-white/70 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Exam Title</th>
                                    <th className="px-6 py-4">University</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Scheduled Date</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Total Marks</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {exams.map((exam) => {
                                    const isUpcoming = new Date(exam.scheduledDate) > new Date();
                                    return (
                                        <tr key={exam._id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 text-white font-semibold">{exam.title}</td>
                                            <td className="px-6 py-4 text-white/70">
                                                {exam.targetUniversity
                                                    ? (exam.targetUniversity.profile?.universityName || exam.targetUniversity.name || 'University Account')
                                                    : 'All Universities'}
                                            </td>
                                            <td className="px-6 py-4 text-white/70">{exam.course?.title || 'N/A'}</td>
                                            <td className="px-6 py-4 text-white/70">
                                                {new Date(exam.scheduledDate).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-white/70">{exam.duration} min</td>
                                            <td className="px-6 py-4 text-white/70">{exam.totalPoints || exam.totalMarks}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isUpcoming
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-white/10 text-white/50'
                                                    }`}>
                                                    {isUpcoming ? 'Upcoming' : 'Completed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(exam._id)}
                                                    className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Delete Exam"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-start justify-center p-4 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                            setFormData({ title: '', course: '', scheduledDate: '', duration: 60, totalMarks: 100, passingMarks: 40 });
                        }
                    }}
                >
                    <GlassCard className="w-full max-w-xl relative z-[100000] my-8 bg-black/95 border-white/20" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-base font-semibold text-white mb-4 font-inter">Schedule New Exam</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-white/70 text-xs mb-1.5">Exam Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-white/70 text-xs mb-1.5">Target University</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                        value={formData.targetUniversity || ''}
                                        onChange={(e) => {
                                            console.log('Targeting University ID:', e.target.value);
                                            setFormData({ ...formData, targetUniversity: e.target.value });
                                        }}
                                    >
                                        <option value="">Select University</option>
                                        {universities && universities.length > 0 ? universities.map((uni) => (
                                            <option key={uni._id} value={uni._id} className="bg-[#0B0F1A]">
                                                {uni.name} ({uni.profile?.universityName || 'Uni'})
                                            </option>
                                        )) : <option disabled>No Universities Found</option>}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/70 text-xs mb-1.5">Course</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                        value={formData.course}
                                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map((course) => (
                                            <option key={course._id} value={course._id} className="bg-[#0B0F1A]">
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-white/70 text-xs mb-1.5">Scheduled Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-xs mb-1.5">Duration (min)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-white/70 text-xs mb-1.5">Total Marks</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                        value={formData.totalMarks}
                                        onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-xs mb-1.5">Passing Marks</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                                        value={formData.passingMarks}
                                        onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({ title: '', course: '', scheduledDate: '', duration: 60, totalMarks: 100, passingMarks: 40 });
                                    }}
                                    className="flex-1 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <ModernButton type="submit" className="flex-1 !py-2 text-sm">
                                    Schedule Exam
                                </ModernButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}
        </>
    );
};

export default ExamScheduler;
