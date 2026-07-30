import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConsentsQuery } from "../../hooks/consent/query/useConsents.query";
import { useSentConsentMutation } from "../../hooks/consent/mutation/useSentConsent.mutation";
import { useProfileQuery } from "../../hooks/auth/query/useProfile.query";
import { consentValues } from "./components/consentFormValues";
import { consentValidation } from "./components/consentFormValidation";
import DataTable, { type Column } from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import ExportButton from "../components/dashboard/ExportButton";
import ResentLinkButton from "../components/dashboard/ResentLinkButton";
import PageHeader from "../../components/layout/PageHeader";

const loanOptions = [
  { label: "Personal Loan", value: "Personal Loan" },
  { label: "Vehicle Loan", value: "Vehicle Loan" },
  { label: "Home Loan", value: "Home Loan" },
  { label: "Business Loan", value: "Business Loan" },
];

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  SENT: "info",
  OTP_VERIFIED: "warning",
  CONSENTED: "success",
  EXPIRED: "danger",
};

export default function Consents() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useConsentsQuery({ page, limit: 15, search: "" });
  const { data: profileData } = useProfileQuery();
  const { mutateAsync: sentConsent, isPending } = useSentConsentMutation();

  const isAdmin = profileData?.data?.roles?.includes("admin");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(consentValidation),
    defaultValues: consentValues,
  });

  const onSubmit = async (formData: any) => {
    const res = await sentConsent(formData);
    if (res.status === "success") {
      reset();
      refetch();
    }
  };

  const items = data?.data?.items || [];
  const pageData = data?.data?.pageData;

  const columns: Column<any>[] = [
    {
      key: "consentId",
      label: "Consent ID",
      sortable: true,
      render: (item) => <span className="font-mono text-xs">{item.consentId}</span>,
    },
    {
      key: "name",
      label: "Customer",
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-medium">{item.name}</p>
          <p className="text-[11px] text-mgm-muted">{item.mobile}</p>
        </div>
      ),
    },
    {
      key: "pan",
      label: "PAN",
      render: (item) => (
        <span className="font-mono text-xs">
          {isAdmin ? item.pan : `${item.pan?.slice(0, 3)}****${item.pan?.slice(-1)}`}
        </span>
      ),
    },
    {
      key: "loanPurpose",
      label: "Loan Type",
      render: (item) => <span className="text-mgm-muted">{item.loanPurpose}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge variant={statusVariant[item.status] || "default"} size="sm">
          {item.status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-mgm-muted">
          {new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "_id",
      label: "",
      render: (item) =>
        item.status === "EXPIRED" ? (
          <ResentLinkButton id={item._id} refetch={refetch} />
        ) : null,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Consent Verification"
        subtitle="Manage credit information consent requests"
        breadcrumbs={[{ label: "Consents" }]}
        action={isAdmin ? <ExportButton /> : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Create Form */}
        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">New Consent Request</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input label="Full Name" placeholder="Enter customer name" {...register("name")} error={errors.name?.message} />
            <Input label="Mobile Number" placeholder="10-digit mobile" {...register("mobile")} error={errors.mobile?.message} />
            <Input label="PAN Number" placeholder="ABCDE1234F" {...register("pan")} error={errors.pan?.message} />
            <Select label="Loan Purpose" options={loanOptions} placeholder="Select loan type" {...register("loanPurpose")} error={errors.loanPurpose?.message} />
            <Button type="submit" loading={isPending} className="w-full mt-2">
              Send Consent Link
            </Button>
          </form>
        </Card>

        {/* Consent List */}
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={items}
            loading={isLoading}
            searchable
            searchPlaceholder="Search by name, mobile, PAN, or ID..."
            searchKeys={["name", "mobile", "pan", "consentId"]}
            emptyTitle="No consents found"
            emptyDescription="Send your first consent request using the form."
            pagination={
              pageData
                ? {
                    page: pageData.page,
                    totalPages: pageData.totalPages,
                    total: pageData.total,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
