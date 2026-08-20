import { useState, useEffect } from "react";
import { useSettingsQuery } from "../../hooks/settings/query/useSettings.query";
import { useUpdateSettingsMutation } from "../../hooks/settings/mutation/useUpdateSettings.mutation";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

interface SettingsData {
  bankNames: string[];
  stats: {
    yearsOfLending: number;
    customersServed: number;
    employees: number;
    operationalLocations: number;
    loansDisbursedCr: number;
  };
  milestones: Milestone[];
  rbiWording: string;
  companyTagline: string;
  heroTitle: string;
}

export default function Settings() {
  const { data, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const [form, setForm] = useState<SettingsData>({
    bankNames: [],
    stats: { yearsOfLending: 28, customersServed: 3000, employees: 50, operationalLocations: 35, loansDisbursedCr: 25 },
    milestones: [],
    rbiWording: "",
    companyTagline: "",
    heroTitle: "",
  });
  const [newBank, setNewBank] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setForm(data.data);
    }
  }, [data]);

  const handleSave = async () => {
    await updateMutation.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addBank = () => {
    if (newBank.trim()) {
      setForm((f) => ({ ...f, bankNames: [...f.bankNames, newBank.trim()] }));
      setNewBank("");
    }
  };

  const removeBank = (index: number) => {
    setForm((f) => ({ ...f, bankNames: f.bankNames.filter((_, i) => i !== index) }));
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    setForm((f) => ({
      ...f,
      milestones: f.milestones.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    }));
  };

  const addMilestone = () => {
    setForm((f) => ({
      ...f,
      milestones: [...f.milestones, { year: "", title: "", desc: "" }],
    }));
  };

  const removeMilestone = (index: number) => {
    setForm((f) => ({ ...f, milestones: f.milestones.filter((_, i) => i !== index) }));
  };

  const updateStat = (field: keyof SettingsData["stats"], value: number) => {
    setForm((f) => ({ ...f, stats: { ...f.stats, [field]: value } }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Site Settings" subtitle="Manage website content" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Settings"
        subtitle="Manage website content — bank names, stats, milestones, and more"
        action={
          <Button onClick={handleSave} loading={updateMutation.isPending}>
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        }
      />

      {/* Bank Names */}
      <div className="bg-white rounded-xl border border-mgm-border p-6">
        <h2 className="text-sm font-bold text-mgm-navy mb-4">Bank Names</h2>
        <p className="text-xs text-mgm-muted mb-4">Displayed in the "Trusted by" section on the homepage</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.bankNames.map((bank, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mgm-gold/10 text-mgm-navy text-xs font-medium rounded-lg">
              {bank}
              <button onClick={() => removeBank(i)} className="text-mgm-muted hover:text-red-500 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newBank} onChange={(e) => setNewBank(e.target.value)} placeholder="Add bank name" onKeyDown={(e) => e.key === "Enter" && addBank()} />
          <Button variant="secondary" size="sm" onClick={addBank}>Add</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-mgm-border p-6">
        <h2 className="text-sm font-bold text-mgm-navy mb-4">Statistics</h2>
        <p className="text-xs text-mgm-muted mb-4">Counter values displayed across the website</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Input label="Years of Lending" type="number" value={form.stats.yearsOfLending} onChange={(e) => updateStat("yearsOfLending", +e.target.value)} />
          <Input label="Customers Served" type="number" value={form.stats.customersServed} onChange={(e) => updateStat("customersServed", +e.target.value)} />
          <Input label="Employees" type="number" value={form.stats.employees} onChange={(e) => updateStat("employees", +e.target.value)} />
          <Input label="Operational Locations" type="number" value={form.stats.operationalLocations} onChange={(e) => updateStat("operationalLocations", +e.target.value)} />
          <Input label="Loans Disbursed (Cr)" type="number" value={form.stats.loansDisbursedCr} onChange={(e) => updateStat("loansDisbursedCr", +e.target.value)} />
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-xl border border-mgm-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-mgm-navy">Milestones</h2>
            <p className="text-xs text-mgm-muted mt-1">Company journey timeline displayed on the About page</p>
          </div>
          <Button variant="secondary" size="sm" onClick={addMilestone}>+ Add Milestone</Button>
        </div>
        <div className="space-y-3">
          {form.milestones.map((m, i) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
              <div className="flex gap-2 flex-1">
                <Input value={m.year} onChange={(e) => updateMilestone(i, "year", e.target.value)} placeholder="Year" className="w-24" />
                <Input value={m.title} onChange={(e) => updateMilestone(i, "title", e.target.value)} placeholder="Title" className="flex-1" />
                <Input value={m.desc} onChange={(e) => updateMilestone(i, "desc", e.target.value)} placeholder="Description" className="flex-1" />
              </div>
              <button onClick={() => removeMilestone(i)} className="p-2 text-mgm-muted hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Text Content */}
      <div className="bg-white rounded-xl border border-mgm-border p-6">
        <h2 className="text-sm font-bold text-mgm-navy mb-4">Text Content</h2>
        <div className="space-y-4">
          <Input label="Hero Title" value={form.heroTitle} onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))} />
          <Input label="Company Tagline" value={form.companyTagline} onChange={(e) => setForm((f) => ({ ...f, companyTagline: e.target.value }))} />
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-mgm-muted mb-1.5">RBI Wording</label>
            <textarea
              value={form.rbiWording}
              onChange={(e) => setForm((f) => ({ ...f, rbiWording: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 text-sm bg-white border border-mgm-border rounded-xl outline-none transition-colors focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
