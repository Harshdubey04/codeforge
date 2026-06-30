import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProblemById, updateProblem } from "../../api/problemAPI";

// ================= ZOD SCHEMA =================

const editProblemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.enum(["Array", "Linked List", "Graph", "DP"])).min(1, "Select at least one tag"),
  functionName: z.string().min(1, "Function name is required"),

  visibleTestCases: z.array(z.object({
    input:       z.string().min(1, "Input is required"),
    output:      z.string().min(1, "Output is required"),
    explanation: z.string().min(1, "Explanation is required"),
  })).min(1),

  hiddenTestCases: z.array(z.object({
    input:  z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
  })).min(1),

  startCode: z.array(z.object({
    language:    z.string().min(1),
    initialCode: z.string().min(1, "Starter code is required"),
  })).min(1),

  referenceSolution: z.array(z.object({
    language:     z.string().min(1),
    completeCode: z.string().min(1, "Solution is required"),
  })).min(1),
});

// ================= COMPONENT =================

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editProblemSchema),
  });

  const visibleTC  = useFieldArray({ control, name: "visibleTestCases" });
  const hiddenTC   = useFieldArray({ control, name: "hiddenTestCases" });
  const startCodes = useFieldArray({ control, name: "startCode" });
  const refSols    = useFieldArray({ control, name: "referenceSolution" });

  // Load existing problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        reset(data); // prefill the form
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      await updateProblem(id, data);
      navigate("/admin/dashboard");
    } catch (error) {
      setError("root", {
        message: "Failed to update problem. Check your reference solution."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Edit Problem</h1>
        <p className="text-base-content/60 mt-1">
          Update the problem details below.
        </p>
      </div>

      {errors.root && (
        <div className="alert alert-error">
          <span>{errors.root.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Basic Info ── */}
        <div className="card bg-base-200 border border-base-300 shadow-md">
          <div className="card-body space-y-4">

            <h2 className="text-xl font-bold">📝 Basic Info</h2>

            <div className="form-control">
              <label className="label"><span className="label-text">Title</span></label>
              <input
                type="text"
                className="input input-bordered"
                {...register("title")}
              />
              {errors.title && <p className="text-error text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Description</span></label>
              <textarea
                className="textarea textarea-bordered h-32"
                {...register("description")}
              />
              {errors.description && <p className="text-error text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="form-control">
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select className="select select-bordered" {...register("difficulty")}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Function Name</span></label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("functionName")}
                />
                {errors.functionName && <p className="text-error text-sm mt-1">{errors.functionName.message}</p>}
              </div>

            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Tags</span></label>
              <div className="flex gap-4 flex-wrap">
                {["Array", "Linked List", "Graph", "DP"].map(tag => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={tag}
                      className="checkbox checkbox-primary checkbox-sm"
                      {...register("tags")}
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))}
              </div>
              {errors.tags && <p className="text-error text-sm mt-1">{errors.tags.message}</p>}
            </div>

          </div>
        </div>

        {/* ── Visible Test Cases ── */}
        <div className="card bg-base-200 border border-base-300 shadow-md">
          <div className="card-body space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">🟢 Visible Test Cases</h2>
              <button type="button" className="btn btn-sm btn-outline"
                onClick={() => visibleTC.append({ input: "", output: "", explanation: "" })}>
                + Add
              </button>
            </div>

            {visibleTC.fields.map((field, index) => (
              <div key={field.id} className="card bg-base-100 border border-base-300 p-4 space-y-3">

                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Test Case {index + 1}</span>
                  {visibleTC.fields.length > 1 && (
                    <button type="button" className="btn btn-xs btn-ghost text-error"
                      onClick={() => visibleTC.remove(index)}>
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label"><span className="label-text text-xs">Input</span></label>
                    <input className="input input-bordered input-sm w-full"
                      {...register(`visibleTestCases.${index}.input`)} />
                    {errors.visibleTestCases?.[index]?.input && (
                      <p className="text-error text-xs mt-1">{errors.visibleTestCases[index].input.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label"><span className="label-text text-xs">Output</span></label>
                    <input className="input input-bordered input-sm w-full"
                      {...register(`visibleTestCases.${index}.output`)} />
                    {errors.visibleTestCases?.[index]?.output && (
                      <p className="text-error text-xs mt-1">{errors.visibleTestCases[index].output.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label"><span className="label-text text-xs">Explanation</span></label>
                  <input className="input input-bordered input-sm w-full"
                    {...register(`visibleTestCases.${index}.explanation`)} />
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* ── Hidden Test Cases ── */}
        <div className="card bg-base-200 border border-base-300 shadow-md">
          <div className="card-body space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">🔴 Hidden Test Cases</h2>
              <button type="button" className="btn btn-sm btn-outline"
                onClick={() => hiddenTC.append({ input: "", output: "" })}>
                + Add
              </button>
            </div>

            {hiddenTC.fields.map((field, index) => (
              <div key={field.id} className="card bg-base-100 border border-base-300 p-4 space-y-3">

                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Test Case {index + 1}</span>
                  {hiddenTC.fields.length > 1 && (
                    <button type="button" className="btn btn-xs btn-ghost text-error"
                      onClick={() => hiddenTC.remove(index)}>
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label"><span className="label-text text-xs">Input</span></label>
                    <input className="input input-bordered input-sm w-full"
                      {...register(`hiddenTestCases.${index}.input`)} />
                  </div>
                  <div>
                    <label className="label"><span className="label-text text-xs">Output</span></label>
                    <input className="input input-bordered input-sm w-full"
                      {...register(`hiddenTestCases.${index}.output`)} />
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* ── Starter Code ── */}
        <div className="card bg-base-200 border border-base-300 shadow-md">
          <div className="card-body space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">💻 Starter Code</h2>
              <button type="button" className="btn btn-sm btn-outline"
                onClick={() => startCodes.append({ language: "javascript", initialCode: "" })}>
                + Add
              </button>
            </div>

            {startCodes.fields.map((field, index) => (
              <div key={field.id} className="card bg-base-100 border border-base-300 p-4 space-y-3">

                <div className="flex justify-between items-center">
                  <select className="select select-bordered select-sm"
                    {...register(`startCode.${index}.language`)}>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c++">C++</option>
                  </select>
                  {startCodes.fields.length > 1 && (
                    <button type="button" className="btn btn-xs btn-ghost text-error"
                      onClick={() => startCodes.remove(index)}>
                      ✕ Remove
                    </button>
                  )}
                </div>

                <textarea className="textarea textarea-bordered w-full h-32 font-mono text-sm"
                  {...register(`startCode.${index}.initialCode`)} />

              </div>
            ))}

          </div>
        </div>

        {/* ── Reference Solution ── */}
        <div className="card bg-base-200 border border-base-300 shadow-md">
          <div className="card-body space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">✅ Reference Solution</h2>
              <button type="button" className="btn btn-sm btn-outline"
                onClick={() => refSols.append({ language: "javascript", completeCode: "" })}>
                + Add
              </button>
            </div>

            {refSols.fields.map((field, index) => (
              <div key={field.id} className="card bg-base-100 border border-base-300 p-4 space-y-3">

                <div className="flex justify-between items-center">
                  <select className="select select-bordered select-sm"
                    {...register(`referenceSolution.${index}.language`)}>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c++">C++</option>
                  </select>
                  {refSols.fields.length > 1 && (
                    <button type="button" className="btn btn-xs btn-ghost text-error"
                      onClick={() => refSols.remove(index)}>
                      ✕ Remove
                    </button>
                  )}
                </div>

                <textarea className="textarea textarea-bordered w-full h-40 font-mono text-sm"
                  {...register(`referenceSolution.${index}.completeCode`)} />

              </div>
            ))}

          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full btn-lg"
        >
          {isSubmitting
            ? <><span className="loading loading-spinner loading-sm"></span> Validating & Updating...</>
            : "✅ Update Problem"
          }
        </motion.button>

      </form>
    </div>
  );
};

export default EditProblem;