import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'

const Payment = () => {
  return (
    <Authenticated header={<h2>Payment Analytics</h2>}>
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        
        <div className="p-8 max-w-7xl mx-auto w-full space-y-10">
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h3 className="text-4xl serif-font font-semibold text-on-background">Financial Overview</h3>
              <p className="text-on-surface-variant mt-2 max-w-lg">Monitor your tuition balance, upcoming installments, and official documentation for the current 2023-2024 academic year.</p>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-high px-5 py-3 rounded-xl border border-outline-variant/40">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-on-surface-variant">Active Semester: Fall 2024</span>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">Remaining Balance</p>
                    <h4 className="text-5xl serif-font font-bold text-primary mt-2">2,450.00 <span className="text-2xl font-medium">DH</span></h4>
                  </div>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Next Due: Oct 15</span>
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-10">
                  <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 group">
                    <span>Pay Now</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                  </button>
                  <button className="border border-outline text-on-surface px-8 py-3 rounded-lg font-bold hover:bg-surface-container-low transition-colors">
                    View Installments
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
            <div className="bg-surface-container-high rounded-3xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col justify-between">
              <div>
                <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest mb-6">Payment Status</p>
                <div className="relative pt-1">
                  <div className="flex mb-4 items-center justify-between">
                    <div>
                      <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-on-primary bg-primary">
                        60% Completed
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold inline-block text-primary">
                        15,000 / 25,000 DH
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white">
                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary" /* style="width:60%" */></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You have successfully covered 60% of your annual tuition. Maintaining this pace will ensure full eligibility for final examinations.
              </p>
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl serif-font font-semibold">Payment History</h4>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  View All Transactions <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
              <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 overflow-hidden shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/50 border-b border-outline-variant/30">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Method</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    <tr className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-6 py-5 text-sm">Sep 12, 2024</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-on-surface-variant" data-icon="credit_card">credit_card</span>
                          <span className="text-sm">Visa **** 4421</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold">2,500.00 DH</td>
                      <td className="px-6 py-5">
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">Paid</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="hover:bg-primary/10 p-2 rounded-full transition-colors text-primary">
                          <span className="material-symbols-outlined" data-icon="download">download</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-6 py-5 text-sm">Aug 15, 2024</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-on-surface-variant" data-icon="account_balance">account_balance</span>
                          <span className="text-sm">Bank Transfer</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold">2,500.00 DH</td>
                      <td className="px-6 py-5">
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">Paid</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="hover:bg-primary/10 p-2 rounded-full transition-colors text-primary">
                          <span className="material-symbols-outlined" data-icon="download">download</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-6 py-5 text-sm">Jul 10, 2024</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-on-surface-variant" data-icon="payments">payments</span>
                          <span className="text-sm">Cash Deposit</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold">5,000.00 DH</td>
                      <td className="px-6 py-5">
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">Pending</span>
                      </td>
                      <td className="px-6 py-5 text-right opacity-50 cursor-not-allowed">
                        <span className="material-symbols-outlined p-2" data-icon="hourglass_empty">hourglass_empty</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl serif-font font-semibold">Official Invoices</h4>
              <div className="space-y-4">
                <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 flex items-center gap-4 hover:border-primary/40 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined" data-icon="description">description</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Fall Semester Invoice</p>
                    <p className="text-xs text-on-surface-variant">Issued Sep 01, 2024</p>
                  </div>
                  <button className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                  </button>
                </div>
                <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 flex items-center gap-4 hover:border-primary/40 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined" data-icon="description">description</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Enrollment Fee Receipt</p>
                    <p className="text-xs text-on-surface-variant">Issued Jun 15, 2024</p>
                  </div>
                  <button className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                  </button>
                </div>
                <div className="bg-surface-container-high/50 rounded-2xl p-6 border border-dashed border-outline-variant flex flex-col items-center text-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-4xl" data-icon="help">help</span>
                  <p className="text-sm font-medium text-on-surface-variant">Missing an invoice? Contact the administration office.</p>
                  <a className="text-primary text-xs font-bold underline" href="#">Request Support</a>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h4 className="text-2xl serif-font font-semibold">Installment Timeline</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-medium text-on-surface-variant uppercase">Paid</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-surface-container-highest"></div>
                  <span className="text-xs font-medium text-on-surface-variant uppercase">Upcoming</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-10 border border-outline-variant/20 overflow-x-auto">
              <div className="min-w-[800px] relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-highest -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 w-3/5 h-1 bg-primary -translate-y-1/2"></div>
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">July</span>
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm z-10"></div>
                    <div className="text-center">
                      <p className="text-sm font-bold">5,000 DH</p>
                      <span className="material-symbols-outlined text-primary text-base" data-icon="check_circle" /* style="font-variation-settings: 'FILL' 1;" */>check_circle</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">August</span>
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm z-10"></div>
                    <div className="text-center">
                      <p className="text-sm font-bold">2,500 DH</p>
                      <span className="material-symbols-outlined text-primary text-base" data-icon="check_circle" /* style={'font-variation-settings: 'FILL' 1;'} */>check_circle</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-primary">September</span>
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-primary shadow-lg z-10 flex items-center justify-center -mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-primary">2,500 DH</p>
                      <p className="text-[10px] text-primary font-bold">CURRENT</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">October</span>
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest border-4 border-white shadow-sm z-10"></div>
                    <div className="text-center opacity-40">
                      <p className="text-sm font-bold">2,500 DH</p>
                      <span className="text-[10px] font-bold">SCHEDULED</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">November</span>
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest border-4 border-white shadow-sm z-10"></div>
                    <div className="text-center opacity-40">
                      <p className="text-sm font-bold">2,500 DH</p>
                      <span className="text-[10px] font-bold">SCHEDULED</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">December</span>
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest border-4 border-white shadow-sm z-10"></div>
                    <div className="text-center opacity-40">
                      <p className="text-sm font-bold">10,000 DH</p>
                      <span className="text-[10px] font-bold">FINAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <footer className="mt-auto border-t border-outline-variant/30 py-8 px-8 text-center md:text-left">
          <p className="text-xs text-on-surface-variant font-medium">© 2024 Info Saloua Student Portal. All financial transactions are secured by 256-bit SSL encryption.</p>
        </footer>
      </main>
    </Authenticated>
  )
}

export default Payment