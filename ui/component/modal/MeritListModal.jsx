import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  Search,
  Filter,
  Download,
  Share2,
  Calendar,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCentralArchiveStore } from '@/store/CentralArchiveStore';
import { useRouter } from 'next/navigation';
import { useHomeStore } from '@/store/HomeStore';

// Rank Badge Component
const RankBadge = ({ rank }) => {
  const getRankStyle = () => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
    if (rank <= 10) return 'bg-gradient-to-r from-blue-500 to-blue-700 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  const getRankIcon = () => {
    if (rank === 1) return <Crown className="w-4 h-4" />;
    if (rank === 2) return <Trophy className="w-4 h-4" />;
    if (rank === 3) return <Medal className="w-4 h-4" />;
    if (rank <= 10) return <Award className="w-4 h-4" />;
    return null;
  };

  return (
    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${getRankStyle()}`}>
      {getRankIcon()}
      <span>#{rank}</span>
    </div>
  );
};

// Student Card Component
const StudentCard = ({ student, rank, isCurrentUser = false }) => {
  const getScoreColor = (mark) => {
    if (mark >= 18) return 'text-green-600';
    if (mark >= 15) return 'text-blue-600';
    if (mark >= 10) return 'text-yellow-600';
    if (mark >= 0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (mark) => {
    if (mark >= 18) return 'bg-green-50 border-green-200';
    if (mark >= 15) return 'bg-blue-50 border-blue-200';
    if (mark >= 10) return 'bg-yellow-50 border-yellow-200';
    if (mark >= 0) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      className={`
        p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
        ${isCurrentUser 
          ? 'bg-blue-50 border-blue-300 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <RankBadge rank={rank} />
        {isCurrentUser && (
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            You
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {student.user_display_name}
          </h3>
          <p className="text-sm text-gray-600">
            User ID: {student.user_id}
          </p>
        </div>

        <div className={`text-right p-3 rounded-lg border ${getScoreBackground(student.mark)}`}>
          <p className={`text-2xl font-bold ${getScoreColor(student.mark)}`}>
            {student.mark}
          </p>
          <p className="text-xs text-gray-600">Score</p>
        </div>
      </div>
    </motion.div>
  );
};

// Statistics Component
const MeritListStats = ({ meritListData }) => {
  const stats = useMemo(() => {
    if (!meritListData?.merit_list?.length) {
      return {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0
      };
    }

    const scores = meritListData.merit_list.map(item => item.mark);
    const passThreshold = 10; // Assuming 10 is passing score
    
    return {
      totalStudents: scores.length,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      passRate: (scores.filter(score => score >= passThreshold).length / scores.length) * 100
    };
  }, [meritListData]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
        <p className="text-xs text-gray-600">Total Students</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{stats.averageScore.toFixed(1)}</p>
        <p className="text-xs text-gray-600">Average Score</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-yellow-600">{stats.highestScore}</p>
        <p className="text-xs text-gray-600">Highest Score</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-red-600">{stats.lowestScore}</p>
        <p className="text-xs text-gray-600">Lowest Score</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-purple-600">{stats.passRate.toFixed(1)}%</p>
        <p className="text-xs text-gray-600">Pass Rate</p>
      </div>
    </div>
  );
};

// Top 3 Podium Component
const TopThreePodium = ({ topThree }) => {
  if (!topThree || topThree.length < 3) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">🏆 Top Performers</h3>
      <div className="flex items-end justify-center gap-4">
        {/* Second Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-t from-gray-300 to-gray-500 rounded-t-lg p-4 h-24 flex flex-col justify-end">
            <Trophy className="w-6 h-6 text-white mx-auto mb-1" />
            <span className="text-white font-bold text-sm">2nd</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-b-lg p-3">
            <p className="font-semibold text-sm">{topThree[1]?.user_display_name}</p>
            <p className="text-gray-600 text-xs">{topThree[1]?.mark} pts</p>
          </div>
        </motion.div>

        {/* First Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-lg p-4 h-32 flex flex-col justify-end">
            <Crown className="w-8 h-8 text-white mx-auto mb-1" />
            <span className="text-white font-bold">1st</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-b-lg p-3">
            <p className="font-semibold">{topThree[0]?.user_display_name}</p>
            <p className="text-gray-600 text-sm">{topThree[0]?.mark} pts</p>
          </div>
        </motion.div>

        {/* Third Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-t from-amber-600 to-amber-800 rounded-t-lg p-4 h-20 flex flex-col justify-end">
            <Medal className="w-5 h-5 text-white mx-auto mb-1" />
            <span className="text-white font-bold text-sm">3rd</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-b-lg p-3">
            <p className="font-semibold text-sm">{topThree[2]?.user_display_name}</p>
            <p className="text-gray-600 text-xs">{topThree[2]?.mark} pts</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main Archive Modal Component
const MeritListModal = ({ isOpen, onClose, onItemSelect }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('live'); 
  const [loading, setLoading] = useState(false)

  const {
    meritList,
    getMeritList,
    batchId,
    user
  } = useHomeStore();

  // Filtered merit list based on search
  const filteredMeritList = useMemo(() => {
    if (!meritList?.data?.merit_list) return [];
    
    if (!searchTerm) return meritList.data.merit_list;
    
    return meritList.data.merit_list.filter(student =>
      student.user_display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user_id.toString().includes(searchTerm)
    );
  }, [meritList?.data?.merit_list, searchTerm]);

  // Top 3 performers
  const topThree = useMemo(() => {
    if (!meritList?.data?.merit_list) return [];
    return meritList.data.merit_list.slice(0, 3);
  }, [meritList?.data?.merit_list]);

  const fetchData = async (mode = viewMode) => {
    setLoading(true)
    if (!batchId) return;
    
    const modeParam = mode === 'live' ? 1 : 2;

    await getMeritList(batchId, modeParam);
    setLoading(false)
  };


  if (!isOpen) return null;

  if (loading) return <div>Loading...</div>;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  Merit List
                </h1>
                {meritList?.data?.batch && (
                  <p className="text-gray-600 text-sm">{meritList.data.batch}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={()=>{}}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Download Merit List"
                >
                  <Download className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Share Merit List"
                >
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Mode Toggle and Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <motion.button
                  onClick={async () => {
                    setViewMode('live')
                    await fetchData('live')
                  }}
                  disabled={loading}
                  className={`px-4 py-2 rounded-xl border transition-all duration-200 disabled:opacity-50 ${
                    viewMode === 'live'
                      ? 'bg-green-500 text-white border-green-500 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${viewMode === 'live' ? 'bg-white' : 'bg-green-500'}`} />
                    Live
                  </div>
                </motion.button>

                <motion.button
                  onClick={async () => {
                    setViewMode('archive')
                    await fetchData('archive')
                  }}
                  disabled={loading}
                  className={`px-4 py-2 rounded-xl border transition-all duration-200 disabled:opacity-50 ${
                    viewMode === 'archive'
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Archive
                </motion.button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-600">
                  Loading {viewMode === 'live' ? 'live' : 'archived'} merit list...
                </p>
              </div>
            ) : meritList?.merit_list?.length > 0 ? (
              <div>
                {/* Statistics */}
                <MeritListStats meritListData={meritList.data} />

                {/* Top 3 Podium */}
                <TopThreePodium topThree={topThree} />

                {/* Search Results Info */}
                {searchTerm && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">
                      Found {filteredMeritList.length} student(s) matching "{searchTerm}"
                    </p>
                  </div>
                )}

                {/* Merit List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Complete Rankings
                  </h3>
                  
                  {meritList?.merit_list.map((student, index) => {
                    const actualRank = meritList.merit_list.findIndex(s => s.id === student.id) + 1;
                    return (
                      <StudentCard
                        key={student.id}
                        student={student}
                        rank={actualRank}
                        isCurrentUser={student.user_id === user.id}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {meritList?.data?.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                    <button
                      onClick={() => handlePageChange(meritList.data.page - 1)}
                      disabled={!meritList.data.has_previous}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Page {meritList.data.page} of {meritList.data.pages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(meritList.data.page + 1)}
                      disabled={!meritList.data.has_next}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No {viewMode === 'live' ? 'Live' : 'Archived'} Merit List Available
                </h3>
                <p className="text-gray-500">
                  {viewMode === 'live' 
                    ? 'The live merit list will be available during the exam period.' 
                    : 'No archived merit lists found for this batch.'
                  }
                </p>
                {!batchId && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select a batch to view merit list.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MeritListModal;