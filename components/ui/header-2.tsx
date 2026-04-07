'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useScroll } from '@/components/ui/use-scroll';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const scrolled = useScroll(50);
	const pathname = usePathname();
	const [activeHover, setActiveHover] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const links = [
		{ href: '/#rides', label: 'Rides' },
		{ href: '/#stays', label: 'Stays' },
		{ href: '/#about', label: 'About' },
		{ href: '/#gallery', label: 'Gallery' },
		{ href: '/#popular', label: 'Popular' },
		{ href: '/#contact', label: 'Contact' },
	];

	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<>
			{/* Desktop Premium Floating Pipeline */}
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				className={cn(
					'fixed top-0 z-[100] w-full transition-all duration-500 ease-in-out'
				)}
			>
				<motion.nav
					layout
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className={cn(
						'relative flex items-center justify-between transition-all duration-500 w-full px-8 md:px-16',
						(mounted && scrolled) 
							? 'h-16 bg-bg-primary/95 backdrop-blur-md border-b border-white/5 shadow-lg' 
							: 'h-20 bg-transparent border-b border-transparent'
					)}
				>
					{/* Logo */}
					<Link href="/" className="flex items-center group shrink-0 z-50 relative focus-visible:outline-none ml-4 md:ml-8">
						<div className={cn(
							"transition-all duration-500",
							(mounted && scrolled) ? "h-10 w-auto" : "h-14 w-auto"
						)}>
							{mounted ? (
								<Image 
									src="/logo.png" 
									alt="Apex Himalayan Rides" 
									width={200}
									height={100}
									priority
									className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
								/>
							) : (
								<div className="h-full aspect-[2/1] bg-bg-primary/20 animate-pulse rounded-lg" />
							)}
						</div>
					</Link>

					{/* Desktop Links - Spaced appropriately */}
					<div className="hidden xl:flex items-center gap-10">
						{links.map((link) => {
							const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]));
							
							return (
								<Link
									key={link.label}
									href={link.href}
									onMouseEnter={() => setActiveHover(link.label)}
									onMouseLeave={() => setActiveHover(null)}
									className={cn(
										"relative py-2 text-[14px] font-medium tracking-wide transition-colors duration-300",
										(activeHover === link.label || isActive) ? "text-text-primary" : "text-text-secondary"
									)}
								>
									<span className="relative z-10">{link.label}</span>
									{(activeHover === link.label || isActive) && (
										<motion.div
											layoutId="navbar-underline"
											className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent-gold"
											transition={{ type: "spring", stiffness: 380, damping: 30 }}
										/>
									)}
								</Link>
							);
						})}
					</div>

					{/* Desktop Actions */}
					<div className="hidden xl:flex items-center gap-8 shrink-0 z-50">
						<a 
							href="/admin/login" 
							className="text-[13px] font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors duration-300"
						>
							CMS
						</a>
						
						<div className="h-4 w-[1px] bg-white/10" />
						
						<Link 
							href="/#contact" 
							className="text-accent-gold px-10 py-4 rounded-md text-[13px] font-bold uppercase tracking-wider hover:text-accent-gold-hover transition-all duration-300"
						>
							Book Ride
						</Link>
					</div>

					{/* Mobile Menu Toggle */}
					<button
						onClick={() => setOpen(!open)}
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						className="relative z-[150] flex xl:hidden w-11 h-11 items-center justify-center rounded-xl bg-bg-elevated/50 border border-border-default/50 hover:bg-bg-elevated transition-colors"
					>
						<div className="flex flex-col items-end gap-[5px]">
							<motion.span 
								animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
								className="w-6 h-[2px] bg-accent-gold block rounded-full origin-center"
							/>
							<motion.span 
								animate={open ? { width: 0, opacity: 0 } : { width: 24, opacity: 1 }}
								className="w-6 h-[2px] bg-accent-gold/80 block rounded-full"
							/>
							<motion.span 
								animate={open ? { rotate: -45, y: -7, width: 24 } : { rotate: 0, y: 0, width: 14 }}
								className="h-[2px] bg-accent-orange block rounded-full origin-center transition-all duration-300"
							/>
						</div>
					</button>
				</motion.nav>
			</motion.header>

			{/* Full Screen Premium Mobile Menu */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="fixed inset-0 z-[90] bg-bg-primary flex items-center justify-center overflow-hidden"
					>
                        {/* Background Decorative Blur */}
						<div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
						<div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-orange/5 rounded-full blur-[100px] pointer-events-none" />

						<div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center justify-center gap-12">
							<div className="flex flex-col items-center gap-6 text-center w-full">
								{links.map((link, i) => (
									<motion.div
										key={link.label}
										initial={{ opacity: 0, y: 40 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 20 }}
										transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
										className="overflow-hidden w-full"
									>
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											className="block text-4xl sm:text-5xl font-black text-text-primary hover:text-accent-orange transition-all duration-500 py-2"
										>
											{link.label}
										</Link>
									</motion.div>
								))}
							</div>

							<motion.div 
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
								className="flex flex-col w-full gap-4 mt-8"
							>
								<Link 
									href="/#contact" 
									onClick={() => setOpen(false)}
									className="group relative w-full overflow-hidden rounded-2xl py-5 border border-border-default/50 hover:border-accent-orange transition-all duration-300"
								>
									<div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-accent-orange transition-opacity duration-300" />
									<span className="relative z-10 block text-center text-[11px] font-black uppercase tracking-[0.2em] text-text-primary group-hover:text-text-primary transition-colors duration-300">
										Book Your Ride
									</span>
								</Link>

								<a 
									href="/admin/login" 
									onClick={() => setOpen(false)}
									className="w-full py-5 rounded-2xl text-center text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text-primary border border-border-default/20 hover:border-border-default/40 hover:bg-bg-elevated transition-colors duration-300"
								>
									CMS Login
								</a>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
