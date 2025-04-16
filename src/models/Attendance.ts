export interface Attendance {
    id?: number;
    employee_name: string;
    employee_id: string;
    department: string;
    check_in_time?: Date;
    check_out_time?: Date | null;
    created_at?: Date;
}
