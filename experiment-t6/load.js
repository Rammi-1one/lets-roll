// k6 load test: 50 virtual users hit one version of the dashboard endpoint.
import http from 'k6/http';
import { check } from 'k6';
export const options = {
  stages: [ { duration: '10s', target: 50 },   // ramp up to 50 users
            { duration: '30s', target: 50 } ], // hold 50 users
};
export default function () {
  const res = http.get(`http://localhost:3000/${__ENV.ENDPOINT}`);
  check(res, { 'status 200': (r) => r.status === 200 });
}
