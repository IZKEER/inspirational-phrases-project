import React, {useState} from "react"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import classNames from "classnames/bind"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form"

import styles from "./ConversationalForm.module.scss"
import {CheckboxComponent} from "../CheckboxComponent"
import {SubmitButton} from "@components"

const cx = classNames.bind(styles)

const PURPOSE_OPTIONS = [
	"Tell you about my project",
	"Check your availability",
	"Discuss an open position",
	"Find out more about you",
	"Connect with you",
	"Other",
] as const

const SOCIAL_OPTIONS = ["Google", "Social media", "Github", "Friends", "Portfolio", "Other"] as const

const formSchema = z.object({
	name: z.string().min(1, "Please enter your name"),
	company: z.string().min(1, "Please enter company name"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	purpose: z.array(z.enum(PURPOSE_OPTIONS)).min(1, "Please select at least one option"),
	source: z.enum(SOCIAL_OPTIONS, {required_error: "Please select how you found me"}),
	message: z.string().min(25, "Please enter at least 25 characters"),
})

type FormValues = z.infer<typeof formSchema>

const ConversationalForm = () => {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "all",
		defaultValues: {
			name: "",
			company: "",
			email: "",
			purpose: [],
			source: undefined,
			message: "",
		},
	})

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true)
		setSubmitStatus("idle")

		try {
			const formData = {
				access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
				...data,
			}

			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(formData),
			})

			const result = await response.json()

			if (response.status === 200) {
				setSubmitStatus("success")
				form.reset()
			} else {
				setSubmitStatus("error")
			}
		} catch (error) {
			console.error("Submission error:", error)
			setSubmitStatus("error")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			<div className={cx("form-title")}>
				<h3>Hey Marcelo, </h3>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, (errors) => {
						console.log("Form errors:", errors)
					})}
					className={cx("form")}>
					{/* Name */}
					<div className={cx("field-group")}>
						<span className={cx("label")}>My name is</span>
						<FormField
							control={form.control}
							name="name"
							render={({field}) => (
								<FormItem className={cx("input-field")}>
									<FormControl>
										<input
											type="text"
											placeholder="Enter your name *"
											className={cx("input")}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Company */}
						<span className={cx("label")}> I work for</span>
						<FormField
							control={form.control}
							name="company"
							render={({field}) => (
								<FormItem className={cx("input-field")}>
									<FormControl>
										<input
											type="text"
											placeholder="Company name *"
											className={cx("input")}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Email */}
					<div className={cx("field-group")}>
						<span className={cx("label")}>You can reach me at </span>
						<FormField
							control={form.control}
							name="email"
							render={({field}) => (
								<FormItem className={cx("email")}>
									<FormControl>
										<input
											type="email"
											placeholder="Enter your email *"
											className={cx("input")}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Purpose */}
					<div className={cx("field-group", "field-column")}>
						<span className={cx("label")}>I am reaching out to</span>
						<FormField
							control={form.control}
							name="purpose"
							render={({field}) => (
								<FormItem>
									<FormControl>
										<div className={cx("options")}>
											{PURPOSE_OPTIONS.map((option) => (
												<div key={option} className={cx("option-wrapper")}>
													<CheckboxComponent
														id={`purpose-checkbox-${option}`}
														checked={field.value?.includes(option)}
														onCheckedChange={(checked) => {
															const currentValue = field.value || []
															const newValue = checked
																? [...currentValue, option]
																: currentValue.filter((item) => item !== option)
															field.onChange(newValue)
														}}
													/>
													<label
														htmlFor={`purpose-checkbox-${option}`}
														className={cx("option-label")}>
														{option}
													</label>
												</div>
											))}
										</div>
									</FormControl>
									<FormMessage className={cx("message")} />
								</FormItem>
							)}
						/>
					</div>

					{/* Source */}
					<div className={cx("field-group", "field-column")}>
						<span className={cx("label")}>How did I found you? Well,</span>
						<FormField
							control={form.control}
							name="source"
							render={({field}) => (
								<FormItem>
									<FormControl>
										<div className={cx("options")}>
											{SOCIAL_OPTIONS.map((option) => (
												<div key={option} className={cx("option-wrapper")}>
													<CheckboxComponent
														id={`social-checkbox-${option}`}
														checked={field.value === option}
														onCheckedChange={(checked) => {
															if (checked) {
																field.onChange(option)
															}
														}}
													/>
													<label
														htmlFor={`social-checkbox-${option}`}
														className={cx("option-label")}>
														{option}
													</label>
												</div>
											))}
										</div>
									</FormControl>
									<FormMessage className={cx("message")} />
								</FormItem>
							)}
						/>
					</div>

					{/* Message */}
					<div className={cx("field-group")}>
						<span className={cx("label")}>In short,</span>
						<FormField
							control={form.control}
							name="message"
							render={({field}) => (
								<FormItem className={cx("text-message")}>
									<FormControl>
										<textarea
											placeholder="Enter your message *"
											className={cx("textarea")}
											{...field}
										/>
									</FormControl>
									<FormMessage className={cx("message")} />
								</FormItem>
							)}
						/>
					</div>

					{/* Submit Button */}
					<div className={cx("submit-button")}>
						<>
							<div className={cx("form-feedback")}>
								{submitStatus === "success" && (
									<div className={cx("success")}>
										<span> Great! I've received your message and will get back to you soon. </span>
									</div>
								)}
								{submitStatus === "error" && (
									<div className={cx("error")}>
										Something went wrong on my end. Mind trying again?
									</div>
								)}
							</div>

							<SubmitButton
								tabIndex={0}
								aria-disabled={isSubmitting}
								type="submit"
								text={isSubmitting ? "Just a moment..." : "Send message"}
								// text = "Just a moment..." :
								className={cx("submit", {submitting: isSubmitting})}
								disabled={isSubmitting}
							/>
						</>
					</div>

					{/* Form Validation Messages */}
				</form>
			</Form>
		</>
	)
}

export {ConversationalForm}
