import React from "react";
import Image from "next/image";
import { Plus, X, Edit2, Check, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Alignment = "left" | "center" | "right";
type LinkTarget = "_self" | "_blank";

export type MiniCard = {
  id: string;
  title: string;
  tagline: string;
  thumbnailUrl: string;
  linkUrl?: string;
  linkTarget?: LinkTarget;
};

export type MiniCardSectionType = {
  id?: string;
  title?: string;
  titleAlignment?: Alignment;
  cardsAlignment?: Alignment;
  cards: MiniCard[];
};

type MiniCardGridSectionProps = {
  section: MiniCardSectionType;
  isEditMode?: boolean;
  onSectionChange?: (section: MiniCardSectionType) => void;
  onThumbnailSelect?: (cardId: string) => void;
  onDuplicate?: (duplicatedSection: MiniCardSectionType) => void;
};

export const MiniCardGridSection: React.FC<MiniCardGridSectionProps> = ({
  section,
  isEditMode = false,
  onSectionChange,
  onThumbnailSelect,
  onDuplicate,
}) => {
  const {
    title: initialTitle = "Mini Card Row",
    titleAlignment: initialAlignment = "left",
    cardsAlignment: initialCardsAlignment = "left",
    cards = [],
  } = section;

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(initialTitle);
  const [alignment, setAlignment] = React.useState<Alignment>(initialAlignment);
  const [cardsAlignment, setCardsAlignment] = React.useState<Alignment>(initialCardsAlignment);

  React.useEffect(() => {
    setEditedTitle(initialTitle);
    setAlignment(initialAlignment);
    setCardsAlignment(initialCardsAlignment);
  }, [initialTitle, initialAlignment, initialCardsAlignment]);

  const handleCardChange = (cardId: string, updates: Partial<MiniCard>) => {
    if (!onSectionChange) return;
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    onSectionChange({ ...section, cards: updatedCards });
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    onSectionChange?.({ ...section, cards: updatedCards });
  };

  const saveTitle = () => {
    onSectionChange?.({ ...section, title: editedTitle, titleAlignment: alignment, cardsAlignment: cardsAlignment });
    setIsEditingTitle(false);
  };

  const cancelEdit = () => {
    setEditedTitle(initialTitle);
    setIsEditingTitle(false);
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      const duplicatedSection: MiniCardSectionType = {
        ...section,
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2),
        title: section.title ? `${section.title} Copy` : "Mini Card Row Copy",
        cards: [...section.cards],
      };
      onDuplicate(duplicatedSection);
    }
  };

  const alignmentIcons = {
    left: <AlignLeft className="h-4 w-4" />,
    center: <AlignCenter className="h-4 w-4" />,
    right: <AlignRight className="h-4 w-4" />,
  };

  return (
    <section className="py-8 px-4 md:px-8">
      <div className="mb-4">
        <div
          className={`flex ${
            alignment === "left"
              ? "justify-start"
              : alignment === "center"
              ? "justify-center"
              : "justify-end"
          }`}
        >
          <div className="flex items-center gap-2 max-w-full">
            {isEditingTitle ? (
              <>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle();
                    else if (e.key === "Escape") cancelEdit();
                  }}
                  className="text-2xl font-semibold text-gray-900 p-2 border-gray-300"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={saveTitle}>
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit}>
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-900">{initialTitle}</h2>
                {isEditMode && (
                  <div className="flex gap-1 ml-2">
                    <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(true)}>
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {alignmentIcons[alignment]}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(["left", "center", "right"] as Alignment[]).map((align) => (
                          <DropdownMenuItem key={align} onClick={() => setAlignment(align)}>
                            {alignmentIcons[align]}{" "}
                            <span className="ml-2 capitalize">{align}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" title="Cards alignment">
                          {alignmentIcons[cardsAlignment]}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(["left", "center", "right"] as Alignment[]).map((align) => (
                          <DropdownMenuItem key={align} onClick={() => setCardsAlignment(align)}>
                            {alignmentIcons[align]}{" "}
                            <span className="ml-2 capitalize">Cards {align}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`flex flex-wrap gap-4 ${
        cardsAlignment === "left"
          ? "justify-start"
          : cardsAlignment === "center"
          ? "justify-center"
          : "justify-end"
      }`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative w-[120px] h-[120px] bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex flex-col items-center justify-start text-center"
          >
            {isEditMode && (
              <button
                className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={() => handleDeleteCard(card.id)}
                title="Delete card"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="relative group">
              <div className="w-10 h-10 mb-2 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
                {card.thumbnailUrl ? (
                  <Image
                    src={card.thumbnailUrl}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback to a placeholder if the image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder-avatar.png';
                    }}
                  />
                ) : (
                  <Plus className="w-4 h-4 text-gray-400" />
                )}
              </div>
              {isEditMode && (
                <button
                  type="button"
                  className="absolute inset-0 w-10 h-10 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onThumbnailSelect?.(card.id);
                  }}
                  title="Change image"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            {isEditMode ? (
              <div className="flex flex-col items-center gap-1 w-full">
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(card.id, { title: e.target.value })}
                  className="text-xs font-bold text-gray-800 w-full border rounded p-1"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={card.tagline}
                  onChange={(e) => handleCardChange(card.id, { tagline: e.target.value })}
                  className="text-xs text-gray-600 w-full border rounded p-1"
                  placeholder="Tagline"
                />
                <div className="flex gap-1 w-full">
                  <input
                    type="url"
                    value={card.linkUrl || ""}
                    onChange={(e) => handleCardChange(card.id, { linkUrl: e.target.value })}
                    className="text-[10px] flex-1 border rounded p-1"
                    placeholder="Link URL"
                  />
                  <select
                    value={card.linkTarget || "_self"}
                    onChange={(e) =>
                      handleCardChange(card.id, {
                        linkTarget: e.target.value as LinkTarget,
                      })
                    }
                    className="text-[10px] border rounded p-1"
                    title="Link target"
                  >
                    <option value="_self">_self</option>
                    <option value="_blank">_blank</option>
                  </select>
                </div>
              </div>
            ) : (
              <a
                href={card.linkUrl || "#"}
                target={card.linkTarget || "_self"}
                rel={card.linkTarget === "_blank" ? "noopener noreferrer" : undefined}
                className="w-full text-center"
              >
                <p className="text-xs font-bold text-gray-800 line-clamp-2 hover:underline">{card.title}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{card.tagline}</p>
              </a>
            )}
          </div>
        ))}
        {isEditMode && (
          <button
            onClick={() => {
              const newCard: MiniCard = {
                id: `card-${Date.now()}`,
                title: "New Title",
                tagline: "New Tagline",
                thumbnailUrl: "",
                linkUrl: "",
                linkTarget: "_self",
              };
              onSectionChange?.({ ...section, cards: [...cards, newCard] });
            }}
            className="w-[120px] h-[120px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl hover:border-gray-400 text-gray-500"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-xs">Add Card</span>
          </button>
        )}
      </div>

      {isEditMode && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium"
            onClick={handleDuplicate}
          >
            Duplicate
          </button>
        </div>
      )}
    </section>
  );
};
