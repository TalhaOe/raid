export function calculateRaidCapacity(raid, disks, size) {
  const total = disks * size;
  if (raid === '0') return { usable: total, fail: '0', note: 'Maximale Performance' };
  if (raid === '1') return { usable: total / 2, fail: '1 pro Spiegel', note: 'Spiegelung halbiert Kapazität' };
  if (raid === '5') return { usable: Math.max(disks - 1, 0) * size, fail: '1', note: 'Eine Platte entspricht Paritäts-Overhead' };
  if (raid === '6') return { usable: Math.max(disks - 2, 0) * size, fail: '2', note: 'Zwei Platten entsprechen Paritäts-Overhead' };
  return { usable: total / 2, fail: 'mehrere', note: 'Performance + Sicherheit' };
}
export function runInternalChecks(raidLevels) {
  console.assert(calculateRaidCapacity('0',4,2).usable===8,'RAID 0 capacity check failed');
  console.assert(calculateRaidCapacity('1',4,2).usable===4,'RAID 1 capacity check failed');
  console.assert(calculateRaidCapacity('5',4,2).usable===6,'RAID 5 capacity check failed');
  console.assert(calculateRaidCapacity('6',4,2).usable===4,'RAID 6 capacity check failed');
  console.assert(calculateRaidCapacity('10',4,2).usable===4,'RAID 10 capacity check failed');
  console.assert(raidLevels.length===10,'RAID list should contain 10 entries');
}
