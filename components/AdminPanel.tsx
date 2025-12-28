
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { ProductRecord, UserProfile, SystemConfig } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  t: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, t }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'config'>('products');
  const [records, setRecords] = useState<ProductRecord[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setRecords(data);
      } else if (activeTab === 'users') {
        const { data } = await supabase.from('products').select('user_id, user_email, created_at');
        if (data) {
          // Fix: Explicitly type 'id' as string to resolve 'unknown' type assignment error.
          const userIds = Array.from(new Set(data.map(d => String(d.user_id))));
          const uniqueUsers: UserProfile[] = userIds.map((id: string) => {
            const u = data.find(d => String(d.user_id) === id);
            return { 
              id, 
              email: (u as any)?.user_email || '', 
              role: 'user' as const, 
              created_at: (u as any)?.created_at 
            };
          });
          setUsers(uniqueUsers);
        }
      } else if (activeTab === 'config') {
        const { data } = await supabase.from('system_configs').select('*');
        if (data) setConfigs(data);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
    setLoading(false);
  };

  const handleSaveConfig = async (key: string, value: string) => {
    setSaving(true);
    await supabase.from('system_configs').upsert({ key, value });
    setSaving(false);
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">COMMAND CENTER</h2>
          <p className="text-slate-500 text-sm font-medium">Platform Management & Infrastructure Control</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
          {(['products', 'users', 'config'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
          <button onClick={onBack} className="ml-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
            {t.backHome}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Database...</span>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Created</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={r.image_urls[0]} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" />
                          <span className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{r.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 font-medium">{r.user_email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {r.image_urls.map((u, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                              <img src={u} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">First Activity</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                            {u.email[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-xs font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors">Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="p-10 space-y-10">
              <div className="max-w-2xl">
                <h3 className="text-xl font-black text-slate-900 mb-2">System Keys & Infrastructure</h3>
                <p className="text-slate-500 text-sm mb-8">Update service configurations without redeploying. These values will override environment variables if set.</p>
                
                <div className="space-y-6">
                  {[
                    // Fix: Removed GEMINI_API_KEY from UI as per guidelines (must use process.env.API_KEY exclusively).
                    { key: 'CLOUDINARY_CLOUD_NAME', label: 'Cloudinary Cloud Name', icon: 'fa-cloud' },
                    { key: 'CLOUDINARY_UPLOAD_PRESET', label: 'Cloudinary Upload Preset', icon: 'fa-upload' }
                  ].map(item => {
                    const existing = configs.find(c => c.key === item.key);
                    return (
                      <div key={item.key} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <i className={`fa-solid ${item.icon}`}></i> {item.label}
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="password"
                            defaultValue={existing?.value || ''}
                            id={`input-${item.key}`}
                            placeholder="Enter secure key..."
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                          />
                          <button
                            onClick={() => {
                              const val = (document.getElementById(`input-${item.key}`) as HTMLInputElement).value;
                              handleSaveConfig(item.key, val);
                            }}
                            disabled={saving}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex items-start gap-4 text-amber-600 bg-amber-50 p-6 rounded-2xl">
                <i className="fa-solid fa-triangle-exclamation text-xl mt-1"></i>
                <div>
                  <h4 className="font-black text-sm uppercase mb-1">Security Warning</h4>
                  <p className="text-xs leading-relaxed opacity-80">These keys are stored in your database. Ensure your Supabase RLS (Row Level Security) policies are properly configured to prevent unauthorized access to the system_configs table.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
