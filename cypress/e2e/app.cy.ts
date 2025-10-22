
/// <reference types="cypress" />

describe('KPI Dashboard', () => {

  beforeEach(() => {
    cy.intercept('*', (req) => {
      delete req.headers['if-none-match'];
      delete req.headers['if-modified-since'];
      req.headers['cache-control'] = 'no-cache';
    });
    cy.intercept('GET', '/api/metrics?metric=download').as('getDownloadMetrics');
    cy.intercept('GET', '/api/metrics?metric=latency').as('getLatencyMetrics');
  });

  function checkMetricResponse(metric: string, aliasName: string) {
    cy.wait(aliasName).then((i) => {
      const res: any = i.response;
      expect(i.request.method).to.eq('GET');
      expect(i.request.url).to.contain(`/api/metrics?metric=${metric}`);
      expect(res.statusCode).to.eq(200);
      cy.fixture(`defaultResponses/${metric}Response.json`).then((expectedBody) => {
        expect(res.body).to.deep.equal(expectedBody);
      });
    });
    cy.get('canvas#chart').should('be.visible');
    cy.get('#desc').should('contain.text', `<b>${metric}</b> metric`);
  }

  it('TC1_The dashboard renders correctly with default data', () => {
    cy.visit('/');
    cy.get('h1').should('have.text', 'Network KPI Dashboard');
    checkMetricResponse('download', '@getDownloadMetrics');

    cy.get("#metric").select('latency');
    checkMetricResponse('latency', '@getLatencyMetrics');
  });

  it('TC1.2_The dashboard renders correctly with default data - UPLOAD', () => {
    cy.visit('/');
    cy.get('h1').should('have.text', 'Network KPI Dashboard');
    checkMetricResponse('download', '@getDownloadMetrics');

    cy.get("#metric").select('upload');
    checkMetricResponse('upload', '@getLatencyMetrics');
  });

  it('TC2_Request fails once, then succeed', () => {
    let calls = 0;
    cy.intercept('GET', `/api/metrics?metric=download`, (req) => {
      delete req.headers['if-none-match'];
      delete req.headers['if-modified-since'];
      req.headers['cache-control'] = 'no-cache';
      calls += 1;
      if (calls === 1) {
        req.reply({ statusCode: 500, body: { message: 'boom' } });
      } else {
        req.reply();
      }
    }).as('metrics');

    cy.visit('/');

    cy.wait('@metrics').its('response.statusCode').should('eq', 500);

    cy.wait('@metrics').its('response.statusCode').should('eq', 200);
    cy.get('@metrics.all').should('have.length', 2)
    cy.get('#desc').should('contain.text', `<b>download</b> metric`);
  });

  it('TC3_Check chart data', () => {
    cy.intercept('POST', '/graphql').as('gql');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.addEventListener('load', () => {
          const Orig = (win as any).Chart;
          (win as any).Chart = class extends Orig {
            constructor(ctx: any, cfg: any) {
              (win as any).__lastChartCfg = cfg;
              super(ctx, cfg);
            }
          };
        });
      },
    });

    cy.wait('@gql').then(({ response }) => {
      const expected = response!.body.data.kpi.map((p: any) => p.v);
      cy.window().its('__lastChartCfg').should('exist').then((cfg: any) => {
        expect(cfg.data.datasets[0].data).to.deep.equal(expected);
      });
    });

    cy.get('#error').should('not.be.visible');
  });

  it('TC4_Prevents XSS execution and renders text safely', () => {
    cy.intercept('GET', '/api/metrics?metric=download', {
      statusCode: 200,
      body: {
        metric: 'download',
        description: '<img src=x onerror=alert("XSS")>',
        data: [10, 20, 30, 40, 50],
      },
    }).as('getDownloadMetricsXSS');

    const alerts: string[] = [];
    cy.on('window:alert', (str) => {
      alerts.push(str);
    });

    cy.visit('/');
    cy.wait('@getDownloadMetricsXSS');
    cy.get('#metric').select('download');

    cy.wrap(null).should(() => {
      expect(alerts.length).to.eq(0);
    });

    cy.get('#desc').should('contain.text', '<img src=x onerror=alert("XSS")>');

  });
});