// bad types are bad
type GroupedFinding = {
    id: number,
    description?: string,
    grouped_finding_created?: string,
    grouping_key?: string,
    grouping_type?: string,
    owner?: string,
    progress?: number,
    security_analyst?: string,
    severity?: Severity,
    sla?: string,
    status?: string,
    workflow?: string
  }
  
  export type Severity = 'low' | 'medium' | 'high' | 'critical'
  export type SeverityCounts ={[severity in Severity]: number}
  
  export type GroupedFindingWithRawData = GroupedFinding & { raw: RawFinding[] }
  
  export type RawFinding = {
    grouped_finding_id: number,
    id: number,
    asset?: string,
    description?: string,
    finding_created?: string,
    remediation_text?: string,
    remediation_url?: string,
    severity?: string,
    source_collaboration_tool_id?: string,
    source_collaboration_tool_name?: string,
    source_security_tool_id?: string,
    source_security_tool_name?: string,
    status?: string,
    ticket_created?: string,
  }
  
  type DashboardProps = {
    groupedFindings: GroupedFindingWithRawData[],
    isConnected: true
  } | { isConnected: false }