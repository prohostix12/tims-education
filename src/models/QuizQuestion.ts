import mongoose, { Schema, Document } from 'mongoose'

export interface IQuizOption {
  value: string
  label: string
  desc:  string
}

export interface IQuizQuestion extends Document {
  stepId:   string
  order:    number
  question: string
  subtitle: string
  emoji:    string
  active:   boolean
  options:  IQuizOption[]
}

const OptionSchema = new Schema<IQuizOption>(
  { value: String, label: String, desc: { type: String, default: '' } },
  { _id: false },
)

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  stepId:   { type: String, required: true, unique: true },
  order:    { type: Number, default: 0 },
  question: { type: String, required: true },
  subtitle: { type: String, default: '' },
  emoji:    { type: String, default: '❓' },
  active:   { type: Boolean, default: true },
  options:  { type: [OptionSchema], default: [] },
}, { timestamps: true })

export default mongoose.models.QuizQuestion || mongoose.model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema)
