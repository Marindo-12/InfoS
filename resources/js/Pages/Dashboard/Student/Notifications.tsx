import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'

const Notifications = () => {
  return (
    <Authenticated header={<h2>Notifications</h2>}>
      <main className="min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="font-serif text-4xl text-on-surface tracking-tight">Recent Activity</h3>
              <p className="text-stone-500 mt-1">You have 4 unread messages from 'Info Saloua'</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              <span className="material-symbols-outlined text-lg" data-icon="done_all">done_all</span>
              mark all as read
            </button>
          </div>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex gap-4 border-b border-outline-variant/40 pb-px mb-8">
                <button className="px-4 py-2 border-b-2 border-primary text-primary font-bold text-sm tracking-wide">All Activity</button>
                <button className="px-4 py-2 text-stone-500 font-medium text-sm hover:text-primary transition-colors">Academic</button>
                <button className="px-4 py-2 text-stone-500 font-medium text-sm hover:text-primary transition-colors">Financial</button>
                <button className="px-4 py-2 text-stone-500 font-medium text-sm hover:text-primary transition-colors">Center News</button>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-container-lowest p-6 rounded-2xl soft-elevation flex gap-5 border-l-4 border-primary group hover:bg-surface transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl" data-icon="school" /* style="font-variation-settings: 'FILL' 1;" */>school</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif text-xl text-on-surface group-hover:text-primary transition-colors">Final Grade Published: Intro to Design</h4>
                      <span className="text-xs text-stone-400 font-medium">2 mins ago</span>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed mb-3">Your final results for DES101 have been validated by the department. You can now view them in your academic transcript.</p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-surface-container text-[10px] font-bold uppercase tracking-widest text-stone-500 rounded-full">Academic</span>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl soft-elevation flex gap-5 border-l-4 border-primary group hover:bg-surface transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-2xl" data-icon="account_balance_wallet" /* style="font-variation-settings: 'FILL' 1;" */>account_balance_wallet</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif text-xl text-on-surface group-hover:text-primary transition-colors">Scholarship Disbursement Confirmed</h4>
                      <span className="text-xs text-stone-400 font-medium">1 hour ago</span>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed mb-3">The second installment of your Excellence Scholarship has been processed and sent to your registered bank account.</p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-surface-container text-[10px] font-bold uppercase tracking-widest text-stone-500 rounded-full">Financial</span>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl opacity-80 flex gap-5 group hover:opacity-100 transition-all cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-stone-200 flex items-center justify-center text-stone-500">
                    <span className="material-symbols-outlined text-2xl" data-icon="campaign">campaign</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif text-xl text-on-surface">New Workshop: Portfolio MasterclassName</h4>
                      <span className="text-xs text-stone-400 font-medium">Yesterday</span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed mb-3">Join us this Friday for an exclusive session on building industry-standard portfolios with our guest speakers.</p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-surface-container-high text-[10px] font-bold uppercase tracking-widest text-stone-400 rounded-full">Center News</span>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl opacity-80 flex gap-5 group hover:opacity-100 transition-all cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-stone-200 flex items-center justify-center text-stone-500">
                    <span className="material-symbols-outlined text-2xl" data-icon="calendar_month">calendar_month</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif text-xl text-on-surface">Schedule Update: Advanced Typography</h4>
                      <span className="text-xs text-stone-400 font-medium">Oct 24</span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed mb-3">The session scheduled for Monday at 10:00 AM has been moved to Room 402. Please update your planners.</p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-surface-container-high text-[10px] font-bold uppercase tracking-widest text-stone-400 rounded-full">Academic</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-10 text-center">
                <button className="inline-flex items-center gap-2 text-stone-400 font-medium hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined" data-icon="history">history</span>
                  View Archive (24 older notifications)
                </button>
              </div>
            </div>
            <aside className="col-span-12 lg:col-span-4 space-y-8">
              <section className="bg-primary-container/20 p-8 rounded-3xl border border-primary-container/30 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl" data-icon="stars">stars</span>
                </div>
                <h5 className="font-serif text-2xl text-on-primary-fixed-variant mb-4">Important Notice</h5>
                <p className="text-sm text-on-surface/80 leading-relaxed mb-6">
                  Campus registration for the Spring semester closes in <strong>3 days</strong>. Ensure all financial clearances are complete to avoid delays.
                </p>
                <a className="inline-block w-full py-3 bg-primary text-white text-center text-sm font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-primary/20" href="#">
                  Complete Registration
                </a>
              </section>
              <section className="bg-surface-container-lowest p-8 rounded-3xl soft-elevation border border-outline-variant/30">
                <div className="flex justify-between items-center mb-6">
                  <h5 className="font-serif text-2xl text-on-surface">Upcoming</h5>
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">View All</span>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container flex flex-col items-center justify-center text-on-surface-variant flex-shrink-0 group-hover:bg-primary transition-colors group-hover:text-white">
                      <span className="text-xs font-bold uppercase">Oct</span>
                      <span className="text-lg font-bold font-serif leading-none">28</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface mb-0.5">Design Thinking Forum</p>
                      <p className="text-xs text-stone-500">Main Auditorium · 09:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container flex flex-col items-center justify-center text-on-surface-variant flex-shrink-0 group-hover:bg-primary transition-colors group-hover:text-white">
                      <span className="text-xs font-bold uppercase">Nov</span>
                      <span className="text-lg font-bold font-serif leading-none">02</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface mb-0.5">Global Internship Fair</p>
                      <p className="text-xs text-stone-500">Virtual Session · 02:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container flex flex-col items-center justify-center text-on-surface-variant flex-shrink-0 group-hover:bg-primary transition-colors group-hover:text-white">
                      <span className="text-xs font-bold uppercase">Nov</span>
                      <span className="text-lg font-bold font-serif leading-none">05</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface mb-0.5">Typography Showcase</p>
                      <p className="text-xs text-stone-500">Library Gallery · 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </section>
              <div className="relative h-48 rounded-3xl overflow-hidden group">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="collaborative group of students working together in a bright modern workspace with warm natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjIJcSCuky3qy_RVJj59zsfQdaL4eJh-qwRkch6VAYJ9oo7kOznKOpIiyMZbbJKpXycDH1_g54_baEmtVVjqJzcETdiapkz44MguN0Fl__RDGKW52Zz2BO4NS7BsisUnqYIU6RTvjmi96BiaAramA3lZWB1YU17Z9uX_scyLunqjayY-l9NJScHuvKL3pmlSJ7rXp1R5R3n23xrH0feVYiVe6Ni_EXlmY9bWrmr5FvpAII0b95b56JvPM9L40kJ0AacadyvZarDnNV" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <h6 className="text-white font-serif text-xl mb-1">Need Assistance?</h6>
                  <p className="text-stone-300 text-xs mb-3">Our student support team is online.</p>
                  <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 py-2 px-4 rounded-lg text-xs font-bold hover:bg-white hover:text-black transition-colors w-fit">
                    Start Live Chat
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Authenticated>
  )
}

export default Notifications