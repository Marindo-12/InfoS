import React from 'react'

const Students = () => {
  return (
    <main className="p-10 min-h-screen">
<header className="mb-10 flex justify-between items-end">
<div>
<h2 className="font-serif text-5xl text-on-surface tracking-tight mb-2">Gestion des Étudiants &amp; Candidats</h2>
<p className="text-secondary font-body tracking-wide">Vue d'ensemble de votre centre académique aujourd'hui.</p>
</div>
<button className="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:opacity-90 transition-all shadow-sm">
<span className="material-symbols-outlined text-sm">add</span>
                Nouvel Étudiant
            </button>
</header>
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<span className="material-symbols-outlined">group</span>
</div>
<span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
</div>
<p className="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Total Étudiants</p>
<p className="text-3xl font-serif text-on-surface">1,284</p>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-tertiary-container/10 text-tertiary">
<span className="material-symbols-outlined">pending_actions</span>
</div>
<span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-full">8 Nouveaux</span>
</div>
<p className="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Candidatures</p>
<p className="text-3xl font-serif text-on-surface">42</p>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-green-100 text-green-700 rounded-lg">
<span className="material-symbols-outlined">payments</span>
</div>
<span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Mensuel</span>
</div>
<p className="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Revenu Total</p>
<p className="text-3xl font-serif text-on-surface">84,200 <span className="text-sm font-sans">DH</span></p>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-secondary-container text-secondary rounded-lg">
<span className="material-symbols-outlined">school</span>
</div>
</div>
<p className="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Cours Actifs</p>
<p className="text-3xl font-serif text-on-surface">18</p>
</div>
</section>
<section className="mb-12">
<div className="flex justify-between items-center mb-6">
<h3 className="font-serif text-3xl text-on-surface">Candidats à Valider</h3>
<a className="text-primary font-medium text-sm hover:underline" href="#">Voir tout le pipeline</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="bg-white rounded-xl p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
<div className="flex flex-col items-center text-center">
<img alt="Candidate 1" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary/20" data-alt="portrait of a young female student with light eyes looking directly at camera in soft daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTyUBnCsX-NaV_DfFL0vCAgq_4SfUmXzfRvVpqU3RFR9BYg0gju16spuJSHuCyX3r-cWQN1sgeTdMgsaoPP7gPkQwJshS8TYNLx0B5oQsu7PDs5WCYom8X2E57JfxOom3-yEqDVemSLnbb7FVqkZOGp7A3tsUWbiNf3EVjvXLrQ0anPKV_Nc45yztXj8vkz8eqaJg_1qZqTeuC5kFAzkEgmKuUo0TOUL_KQvviSjqvJ20ImVxpk8Ufna5prJWiAGH4gpxun6-tcthc"/>
<h4 className="font-serif text-xl text-on-surface mb-1">Selma Bennani</h4>
<span className="text-xs font-bold py-1 px-3 bg-surface-container-high rounded-full text-secondary mb-6">Concours ENCG</span>
<div className="grid grid-cols-2 gap-2 w-full">
<button className="bg-primary text-white text-xs py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">Approuver</button>
<button className="bg-white border border-outline-variant text-on-surface text-xs py-2.5 rounded-lg font-bold hover:bg-surface-container-low transition-colors">Détails</button>
</div>
</div>
</div>
<div className="bg-white rounded-xl p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
<div className="flex flex-col items-center text-center">
<img alt="Candidate 2" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary/20" data-alt="portrait of a young male professional smiling with warm sun flares highlighting his face" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK5gN4pALp8sBft2Y2g0HS0o_CaMtWv9UUqGUmQg1ekqy9T7G-mgZJjAoPX0skdGTfIY9uOqHj85IiWZuQfZt295estYp-LF_YOAWimV7CuZkRdQLCUNzyl_tV-Juq0oH39hQRvRyVp8XMeWOcr1s9sRN90BdBMCCE3wNoq611teqf7E08_BXGwG8_uEPcysVuZgqzf_MU1U0opGN0XBiOFL7v1y5CY6_LnY1rCJLFu6ac0mdYurnAt23GML2ai6usDTupGwf6wKjw"/>
<h4 className="font-serif text-xl text-on-surface mb-1">Yassine Amrani</h4>
<span className="text-xs font-bold py-1 px-3 bg-surface-container-high rounded-full text-secondary mb-6">Anglais Business</span>
<div className="grid grid-cols-2 gap-2 w-full">
<button className="bg-primary text-white text-xs py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">Approuver</button>
<button className="bg-white border border-outline-variant text-on-surface text-xs py-2.5 rounded-lg font-bold hover:bg-surface-container-low transition-colors">Détails</button>
</div>
</div>
</div>
<div className="bg-white rounded-xl p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
<div className="flex flex-col items-center text-center">
<img alt="Candidate 3" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary/20" data-alt="young professional woman with dark hair and glasses in a studio setting with soft warm key light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABEyUc6lGujp45VB6FKtqw_42Dwv6wPJH_G6vOEP4n8fk899OBcdNCUr7ohq7teNkJf8rAQ4MkdxDuS3sSEA1tWHOa-7cdtLffbTf48tdJhzhB90ecp_tLrjRv9_uMRGbOu3LJGQcPfl7bHkTnW-qApARxLe9WyDBS8Hd64yh3ikkHAlGQaZf8mw1Ggv6Y6Ee07czhV7zipT6SY6OWdQG-cxxyYNNbk_zWwr_xFPrmQfv2o7ReEEUAr2rXUmdqYQqEQ06yqQDoAce7"/>
<h4 className="font-serif text-xl text-on-surface mb-1">Ghita Mansouri</h4>
<span className="text-xs font-bold py-1 px-3 bg-surface-container-high rounded-full text-secondary mb-6">Prépa HEC</span>
<div className="grid grid-cols-2 gap-2 w-full">
<button className="bg-primary text-white text-xs py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">Approuver</button>
<button className="bg-white border border-outline-variant text-on-surface text-xs py-2.5 rounded-lg font-bold hover:bg-surface-container-low transition-colors">Détails</button>
</div>
</div>
</div>
<div className="bg-white rounded-xl p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
<div className="flex flex-col items-center text-center">
<img alt="Candidate 4" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary/20" data-alt="medium shot of a handsome man with a short beard against a blurred neutral wall background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoot9N8ArlJpL5MLAK82swdgPwO7c6UiG6lHP2ohGziOuifhVd_p8ybXZ8e1LTJO2Ahedtik6nTcpcUxdIBrmQwh6e4PA_v__8MU74WRcdJ0IwyzO-v8-eHfsZclQ-w0K2PtmjJBQdrl-vmvDa-eOudCRsoa3qEh7O4nfnqHU7iRH0jmgpjpdMDqjlvEFVX8S3Uuzj7dFVH0e9bubZveiNAocJ5Gz76WtHXm0Rsv5WON_UUiNSxxKBNMHWuc7SXCl4hG9ReZEgW1Qs"/>
<h4 className="font-serif text-xl text-on-surface mb-1">Mehdi Tazi</h4>
<span className="text-xs font-bold py-1 px-3 bg-surface-container-high rounded-full text-secondary mb-6">IELTS Intensive</span>
<div className="grid grid-cols-2 gap-2 w-full">
<button className="bg-primary text-white text-xs py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">Approuver</button>
<button className="bg-white border border-outline-variant text-on-surface text-xs py-2.5 rounded-lg font-bold hover:bg-surface-container-low transition-colors">Détails</button>
</div>
</div>
</div>
</div>
</section>
<section>
<div className="flex justify-between items-center mb-6">
<h3 className="font-serif text-3xl text-on-surface">Liste des Étudiants</h3>
<div className="flex gap-4">
<div className="flex bg-surface-container rounded-lg p-1">
<button className="bg-white px-4 py-1.5 rounded text-xs font-bold shadow-sm">Tous</button>
<button className="px-4 py-1.5 rounded text-xs font-bold text-secondary">Actifs</button>
<button className="px-4 py-1.5 rounded text-xs font-bold text-secondary">Terminés</button>
</div>
</div>
</div>
<div className="bg-white rounded-2xl border border-outline-variant/40 overflow-hidden shadow-[0_2px_16px_rgba(58,48,42,0.02)]">
<div className="grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low border-b border-outline-variant/40 text-xs font-bold text-secondary uppercase tracking-widest">
<div className="col-span-4">Étudiant &amp; Cours</div>
<div className="col-span-2">Statut Paiement</div>
<div className="col-span-3">Progression du Cours</div>
<div className="col-span-2">Dernière Connexion</div>
<div className="col-span-1 text-right">Actions</div>
</div>
<div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-outline-variant/20 items-center hover:bg-surface-bright transition-colors">
<div className="col-span-4 flex items-center gap-4">
<img alt="Student 1" className="w-12 h-12 rounded-lg object-cover" data-alt="portrait of a young woman in a beige knit sweater with soft studio lighting and warm tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoeT0XmxEmuoyJaCJOzId0n4dlUp8p2eK-IK4X9fttGKxk7RBG4wpiHyxZdFjvWNkTFYBTYTpJOjQCdK0QT8TdxSxnfrEt7x7m2JcuhV9As2DrGwCRP1VZWa2xBod0nkVB0vnnG_F1wxyIw573FFe5t5-whd9rf4Z6gP5jlOaxVd5_FOc-kUQxWN-vlf8p9OwAs_x7tKPX8Pm427E8rd_q1SfE6zmAKw0DAJso7cZcza9e38BvcJSs9oRkhrzCTHrmBQHVsCL8EqDd"/>
<div>
<p className="font-bold text-on-surface">Sofia El Alami</p>
<p className="text-xs text-secondary">Préparation Concours ENCG</p>
</div>
</div>
<div className="col-span-2">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Payé</span>
</div>
<div className="col-span-3">
<div className="flex items-center gap-3">
<div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
<div className="bg-primary h-full"></div>
</div>
<span className="text-xs font-bold text-on-surface">75%</span>
</div>
</div>
<div className="col-span-2 text-sm text-on-surface">Aujourd'hui, 09:12</div>
<div className="col-span-1 text-right">
<button className="p-2 hover:bg-stone-100 rounded-lg text-stone-400">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</div>
<div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-outline-variant/20 items-center hover:bg-surface-bright transition-colors">
<div className="col-span-4 flex items-center gap-4">
<img alt="Student 2" className="w-12 h-12 rounded-lg object-cover" data-alt="close up of a cheerful man with expressive brown eyes and short hair in warm golden hour light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz0uprA17TJXTDs6EB6AVQ0SbH-DfG5wNlPBK77gKGWlZ-xnUxK__mqzkhS_9a9qH7ug_Rl5Ry1v8K2We8DQpuh_8leI6Zkwtxzjc-9Fs5GseQqlNNpGvLpwLK40G04lSmQGKUL-kPySaC29RukK2T-wf9-3PaieC85bQO-hgUZHKfNSN1857rpAoAXkpssRvmbeyKhZ8dKKOITrzIBfB9ZoRVxdsrBkqZvvtNY6_E6o_TmW_q2i1Xje7DSpQZ94nRbTxti-czJd-W"/>
<div>
<p className="font-bold text-on-surface">Omar Drissi</p>
<p className="text-xs text-secondary">Advanced English Business</p>
</div>
</div>
<div className="col-span-2">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Partiel</span>
</div>
<div className="col-span-3">
<div className="flex items-center gap-3">
<div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
<div className="bg-primary h-full" /* style="width: 32%" */></div>
</div>
<span className="text-xs font-bold text-on-surface">32%</span>
</div>
</div>
<div className="col-span-2 text-sm text-on-surface">Hier, 18:45</div>
<div className="col-span-1 text-right">
<button className="p-2 hover:bg-stone-100 rounded-lg text-stone-400">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</div>
<div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-outline-variant/20 items-center hover:bg-surface-bright transition-colors">
<div className="col-span-4 flex items-center gap-4">
<img alt="Student 3" className="w-12 h-12 rounded-lg object-cover" data-alt="smiling young woman with smooth skin and dark hair in professional lighting with warm shadow tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaz1e7MlrY9QtwxwDyug1Gdc8iHg4CqArNqyC1AeN-jlX2z_Fa2I4LArDc6j_rOBrlwzNTzdnfqgecuhI8RoZwmuBP3IRIgd5np5PfeELvnKK9vxDb8Fg03FTAnftOEukxgnTM4AfzcDICdMaIwIgHEKqZWHFRgkop4o9IHXOn6_Pdzm9Xk5lDneErVv-lYo6PGjz5MBF3ONdYffsiztzKydWDIvvxzJYsasQKdbqvJn2dbA9GGyDcPexO_NAZy3tX7RWE9loKRl7v"/>
<div>
<p className="font-bold text-on-surface">Inès Benjelloun</p>
<p className="text-xs text-secondary">Mastering Soft Skills</p>
</div>
</div>
<div className="col-span-2">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Retard</span>
</div>
<div className="col-span-3">
<div className="flex items-center gap-3">
<div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
<div className="bg-primary h-full" /* style="width: 90%" */></div>
</div>
<span className="text-xs font-bold text-on-surface">90%</span>
</div>
</div>
<div className="col-span-2 text-sm text-on-surface">Il y a 3 jours</div>
<div className="col-span-1 text-right">
<button className="p-2 hover:bg-stone-100 rounded-lg text-stone-400">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</div>
<div className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-surface-bright transition-colors">
<div className="col-span-4 flex items-center gap-4">
<img alt="Student 4" className="w-12 h-12 rounded-lg object-cover" data-alt="profile headshot of a friendly professional man with short dark hair and slight stubble on soft lit background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcm8-SpFt92nzDNItUrAaiIc0XifQ97r-WBhjiprIKbfAItBYAkO31kvaYDdePEYc63qDgaIO7FpJkclx229hbUR47EeDa-RiIyClyjDsDJdhEM-3tnyrQ6ZSbWFv3GRlBkeVQBmljiCwUpHZ64MJcTdD4UcScxOls_GpJHq4DoP6NkwciUU8Ck2i5SFGnlMRwNY-K_PoWrEIM2lKtJiAcLbCPcm6UKWSFRT7gbJZndmXptr3ObJqapVV3olDbYbdAbD6CtBYBlPfQ"/>
<div>
<p className="font-bold text-on-surface">Anas Filali</p>
<p className="text-xs text-secondary">Pack IELTS 6.5+</p>
</div>
</div>
<div className="col-span-2">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Payé</span>
</div>
<div className="col-span-3">
<div className="flex items-center gap-3">
<div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
<div className="bg-primary h-full" /* style="width: 15%" */></div>
</div>
<span className="text-xs font-bold text-on-surface">15%</span>
</div>
</div>
<div className="col-span-2 text-sm text-on-surface">Aujourd'hui, 08:30</div>
<div className="col-span-1 text-right">
<button className="p-2 hover:bg-stone-100 rounded-lg text-stone-400">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</div>
</div>
<div className="mt-6 flex justify-center">
<nav className="flex gap-1 items-center">
<button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-secondary">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-secondary font-bold">2</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-secondary font-bold">3</button>
<span className="px-2 text-stone-300">...</span>
<button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-secondary font-bold">12</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-secondary">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</nav>
</div>
</section>
</main>
  )
}

export default Students