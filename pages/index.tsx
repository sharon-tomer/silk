import Head from 'next/head'
import {connectToDatabase} from '../lib/mongodb'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import styles from '../styles/Dashboard.module.css'
import CollapsibleTable from '../components/CollapsibleTable'
import Pie from '../components/PieChart'
import Image from 'next/image'
import { DashboardProps, GroupedFinding, GroupedFindingWithRawData, RawFinding, SeverityCounts } from '../types/types'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader'

const Dashboard: NextPage<DashboardProps> = (props: DashboardProps) => {
  const [composedFindings, setComposedFindings] = useState<GroupedFindingWithRawData[]>();
  const [groupedFindings, setGroupedFindings] = useState<GroupedFinding[]>();

  useEffect(() => {
    const rawPromise = fetch('/api/raw')
      .then((res) => res.json())

    const groupedPromise = fetch('/api/grouped')
      .then((res) => res.json())
      .then((data) => {
        setGroupedFindings(data) // we have data for the pie chart
        return data
      })

    Promise.all([rawPromise, groupedPromise])
      .then(([raw, grouped]) => {
        composeFindings({raw, grouped}) // we have data for the table
      })
  }, [])

  function composeFindings(findings: {raw: RawFinding[], grouped: GroupedFinding[]}) {
    const {grouped, raw} = findings
    if(!grouped) return;
    const processedFindings = grouped.map((finding: GroupedFinding) => ({
      ...finding,
      raw: raw.filter((finding: RawFinding) => finding.grouped_finding_id === finding.id)
    }))
    setComposedFindings(processedFindings)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Silk Assignment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.logobox}><Image width={3628} height={972} src={"/logo.png"} layout={'responsive'}/></div>
          <div className={styles.title}>           
            <Typography variant="h2" gutterBottom component="div">
                  Incident Dashboard
            </Typography> 
          </div>
        </div>
        <div className={styles.piechart}>
          {groupedFindings ?
            <>
              <Typography variant="h4" gutterBottom component="div" color={'#F5F5F5'}>
                  Incidents By Severity
              </Typography>
              <Pie data={getSeverityCounts(groupedFindings)}></Pie>
            </>
            : <Loader/>}
        </div>

        <div className={styles.findingstable}>
        {composedFindings?
          <>
            <Typography variant="h4" gutterBottom component="div" color={'#F5F5F5'}>
              Grouped Findings
            </Typography>
            <CollapsibleTable dataSet={composedFindings}></CollapsibleTable>
          </>
         : <Loader/>}
      </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

function getSeverityCounts(groupedFindings: Array<GroupedFinding>) {
  let severityCounts: SeverityCounts = {
    'low': 0,
    'medium': 0,
    'high': 0,
    'critical': 0
  }

  return groupedFindings.reduce((acc, finding) => {
    finding.severity && acc[finding.severity]++
    return acc
  }, severityCounts)
}

export default Dashboard;