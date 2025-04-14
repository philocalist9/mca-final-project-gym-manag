import mongoose from 'mongoose';

export interface IMeal {
  name: string;
  time: string;
  foods: {
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[];
  notes?: string;
}

export interface IDietDay {
  day: string;
  meals: IMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  notes?: string;
}

export interface IDietPlan extends mongoose.Document {
  name: string;
  description: string;
  goal: string;
  caloriesPerDay: number;
  proteinPerDay: number;
  carbsPerDay: number;
  fatsPerDay: number;
  days: IDietDay[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  portion: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fats: {
    type: Number,
    required: true,
  },
});

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  foods: [FoodSchema],
  notes: {
    type: String,
    required: false,
  },
});

const DietDaySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  meals: [MealSchema],
  totalCalories: {
    type: Number,
    required: true,
  },
  totalProtein: {
    type: Number,
    required: true,
  },
  totalCarbs: {
    type: Number,
    required: true,
  },
  totalFats: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
});

const DietPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    goal: {
      type: String,
      required: true,
      enum: ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Performance', 'Health'],
    },
    caloriesPerDay: {
      type: Number,
      required: true,
    },
    proteinPerDay: {
      type: Number,
      required: true,
    },
    carbsPerDay: {
      type: Number,
      required: true,
    },
    fatsPerDay: {
      type: Number,
      required: true,
    },
    days: [DietDaySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate nutrition totals for each day
DietPlanSchema.pre('save', function (next) {
  this.days.forEach(day => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    day.meals.forEach(meal => {
      meal.foods.forEach(food => {
        totalCalories += food.calories;
        totalProtein += food.protein;
        totalCarbs += food.carbs;
        totalFats += food.fats;
      });
    });
    
    day.totalCalories = Math.round(totalCalories);
    day.totalProtein = Math.round(totalProtein);
    day.totalCarbs = Math.round(totalCarbs);
    day.totalFats = Math.round(totalFats);
  });
  
  next();
});

export default mongoose.models.DietPlan || mongoose.model<IDietPlan>('DietPlan', DietPlanSchema); 