// Kiểu dữ liệu chung của 73 dataset actuarial (xem registry.ts).

export type FieldType =
  | "integer"
  | "numeric"
  | "probability" // numeric trong [0, 1]
  | "rate" // lãi suất / tỷ lệ, numeric trong [-1, 10]
  | "money" // numeric, luôn đi kèm cột currency
  | "currency" // mã ISO 4217
  | "text"
  | "date"
  | "timestamp"
  | "boolean"
  | "json";

export type Field = {
  name: string;
  type: FieldType;
  required?: boolean;
  description: string;
  /** Giá trị được phép (enum). */
  allowed?: readonly string[];
  min?: number;
  max?: number;
};

export type ForeignKey = { fields: string[]; references: { dataset: DatasetId; fields: string[] } };

export type DataQuality =
  | "verified" // đối chiếu được với nguồn gốc
  | "transcribed" // chép từ workbook của nhóm, chờ đối chiếu file gốc
  | "report" // lấy trực tiếp từ FINAL.pdf
  | "computed" // do engine tính từ các dataset khác
  | "operational" // dữ liệu nghiệp vụ, phát sinh khi hệ thống vận hành
  | "missing" // nguồn chưa có; chỉ có schema
  | "synthetic"; // dữ liệu giả lập để kiểm thử, không dùng cho kết quả chính thức

export type ModuleId =
  | "life_pricing"
  | "reserving"
  | "rider_pricing"
  | "cis"
  | "claims"
  | "service"
  | "reinsurance"
  | "financial"
  | "sensitivity"
  | "policy_admin"
  | "governance";

export type GroupId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export type DatasetId = `DB${string}`;

export type DatasetDef = {
  id: DatasetId;
  table: string; // tên bảng vật lý (Postgres)
  name: string;
  group: GroupId;
  description: string;
  fields: Field[];
  primaryKey: string[];
  foreignKeys: ForeignKey[];
  validation: string[]; // quy tắc ngoài kiểu dữ liệu, dạng câu
  source: string; // trích dẫn nguồn (mục báo cáo, sheet, quy định)
  quality: DataQuality;
  /** Module dùng dataset; status "planned" là module của đợt sau. */
  usedBy: { module: ModuleId; status: "live" | "planned" }[];
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type Row = Record<string, string | number | boolean | null | Record<string, unknown> | unknown[]>;
