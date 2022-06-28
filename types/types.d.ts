import { ReportData } from './types.d';
export interface Report {
    title:	string,
    description:	string,
    created: string,
    updated: string,
    data:	Array<ReportData>
}

export type ReportData = EmissionData | NetZeroTargetData

export type EmissionData = {
  metricId: 'e1.1.1' | 'e1.2.1' | 'e1.3.1',
  value: number
}

export type NetZeroTargetData = {
  metricId: 'e1.1.1' | 'e1.2.1' | 'e1.3.1',
  value: 'yes' | 'no'
}

export type FormProps = {

}