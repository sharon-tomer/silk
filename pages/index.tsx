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

const Dashboard: NextPage<DashboardProps> = (props: DashboardProps) => {
  return props.isConnected? (
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

        <div className={styles.pieChart}>
            <Typography variant="h4" gutterBottom component="div" color={'#F5F5F5'}>
              Incidents By Severity
            </Typography>
          <Pie data={getSeverityCounts(props.groupedFindings)}></Pie>
        </div>

        <div className={styles.findingsTable}>
            <Typography variant="h4" gutterBottom component="div" color={'#F5F5F5'}>
              Grouped Findings
            </Typography>
          <CollapsibleTable dataSet={props.groupedFindings}></CollapsibleTable>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  ): <div>loading...</div>
}

function getSeverityCounts(groupedFindings: Array<GroupedFinding>) {
  let severityCounts: SeverityCounts = {
    'low': 0,
    'medium': 0,
    'high': 0,
    'critical': 0
  }
  return groupedFindings.reduce((acc, finding) => {
    finding.severity && acc[finding.severity]++;
    return acc;
  }, severityCounts);
}

export const getServerSideProps: GetServerSideProps = async function getServerSideProps() {
  try {
    const { db } = await connectToDatabase();

    const rawDump = await db
      .collection("raw")
      .find({})
      .filter({})
      .toArray()

    const groupedDump = await db
      .collection("grouped")
      .find({})
      .toArray();

    const raw: RawFinding[] = JSON.parse(JSON.stringify(rawDump));
    const grouped: GroupedFinding[] = JSON.parse(JSON.stringify(groupedDump));

    const groupedFindings: GroupedFindingWithRawData[] = grouped.map((finding: GroupedFinding) => ({
      ...finding,
      raw: raw.filter((finding: RawFinding) => finding.grouped_finding_id === finding.id)
    }))

    return {
      props: { isConnected: true, groupedFindings},
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default Dashboard;