import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCheck, HiX, HiEye } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../utils/api';
import { getInitials, getStatusLabel } from '../../utils/helpers';

const PendingRequests = ({ requests = [], onUpdate }) => {
  const [rejectModal, setRejectModal] = useState(null);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.approve(id);
      toast.success('Graduate approved!');
      onUpdate();
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal);
    try {
      await adminAPI.reject(rejectModal, reason);
      toast.success('Graduate rejected');
      setRejectModal(null);
      setReason('');
      onUpdate();
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="card p-12 text-center">
        <HiCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
        <p className="text-gray-500">No pending requests to review</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((grad, i) => (
        <motion.div
          key={grad._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card p-6 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg">
                  {getInitials(grad.fullName)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{grad.fullName}</h3>
                <p className="text-sm text-gray-500">{grad.department}</p>
                <p className="text-sm text-gray-400">Student ID: {grad.studentId}</p>
                <p className="text-sm text-gray-400">Class of {grad.graduationYear}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleApprove(grad._id)}
                disabled={actionLoading === grad._id}
                className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all disabled:opacity-50"
              >
                <HiCheck className="w-5 h-5" />
              </button>
              <button
                onClick={() => setRejectModal(grad._id)}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-all"
              >
                <HiX className="w-5 h-5" />
              </button>
              <a
                href={`/graduate/${grad._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <HiEye className="w-5 h-5" />
              </a>
            </div>
          </div>
          {grad.quote && (
            <p className="mt-3 text-sm text-gray-500 italic pl-2 border-l-2 border-gold-400">
              &ldquo;{grad.quote}&rdquo;
            </p>
          )}
        </motion.div>
      ))}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Profile
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Provide a reason for rejection so the graduate can make corrections.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="input-field mb-4"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setRejectModal(null); setReason(''); }}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!reason || actionLoading === rejectModal}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {actionLoading === rejectModal ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
