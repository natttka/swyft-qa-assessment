
-- Assume PostgreSQL.
-- Task: daily avg download speed and p95 latency for last 7 days.
-- Table: measurements(ts timestamptz, download_mbps numeric, upload_mbps numeric, latency_ms numeric)
-- Write your query below.

SELECT
  date_trunc('day', ts) AS day,
  AVG(download_mbps)    AS avg_download_mbps,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95_latency_ms
FROM measurements
WHERE ts >= now() - interval '7 days'
GROUP BY date_trunc('day', ts)
ORDER BY day;